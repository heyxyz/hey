import { LensHubProxy } from '@abis/LensHubProxy';
import { gql, useMutation, useQuery } from '@apollo/client';
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout';
import ChooseFile from '@components/Shared/ChooseFile';
import Pending from '@components/Shared/Pending';
import SettingsHelper from '@components/Shared/SettingsHelper';
import { Button } from '@components/UI/Button';
import { Card } from '@components/UI/Card';
import { Form, useZodForm } from '@components/UI/Form';
import { Input } from '@components/UI/Input';
import { PageLoading } from '@components/UI/PageLoading';
import { Spinner } from '@components/UI/Spinner';
import { TextArea } from '@components/UI/TextArea';
import useBroadcast from '@components/utils/hooks/useBroadcast';
import Seo from '@components/utils/Seo';
import { CreatePostBroadcastItemResult, Erc20, Mutation, PublicationMainFocus } from '@generated/types';
import {
  CREATE_POST_TYPED_DATA_MUTATION,
  CREATE_POST_VIA_DISPATHCER_MUTATION
} from '@gql/TypedAndDispatcherData/CreatePost';
import { PlusIcon } from '@heroicons/react/outline';
import getIPFSLink from '@lib/getIPFSLink';
import getSignature from '@lib/getSignature';
import getTokenImage from '@lib/getTokenImage';
import imagekitURL from '@lib/imagekitURL';
import { Mixpanel } from '@lib/mixpanel';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import uploadMediaToIPFS from '@lib/uploadMediaToIPFS';
import uploadToArweave from '@lib/uploadToArweave';
import { NextPage } from 'next';
import React, { ChangeEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  ADDRESS_REGEX,
  APP_NAME,
  DEFAULT_COLLECT_TOKEN,
  LENSHUB_PROXY,
  RELAY_ON,
  SIGN_WALLET
} from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { CROWDFUND, PAGEVIEW } from 'src/tracking';
import { v4 as uuid } from 'uuid';
import { useContractWrite, useSignTypedData } from 'wagmi';
import { object, string } from 'zod';

const MODULES_CURRENCY_QUERY = gql`
  query EnabledCurrencyModules {
    enabledModuleCurrencies {
      name
      symbol
      decimals
      address
    }
  }
`;

const newCrowdfundSchema = object({
  title: string()
    .min(2, { message: 'Title should be atleast 2 characters' })
    .max(255, { message: 'Title should not exceed 255 characters' }),
  amount: string().min(1, { message: 'Invalid amount' }),
  goal: string(),
  recipient: string()
    .max(42, { message: 'Ethereum address should be within 42 characters' })
    .regex(ADDRESS_REGEX, { message: 'Invalid Ethereum address' }),
  referralFee: string()
    .min(1, { message: 'Invalid Referral fee' })
    .max(20, { message: 'Invalid Referral fee' }),
  description: string().max(1000, {
    message: 'Description should not exceed 1000 characters'
  })
});

const NewCrowdfund: NextPage = () => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [cover, setCover] = useState('');
  const [coverType, setCoverType] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(DEFAULT_COLLECT_TOKEN);
  const [selectedCurrencySymobol, setSelectedCurrencySymobol] = useState('WMATIC');

  useEffect(() => {
    Mixpanel.track(PAGEVIEW.CREATE_CROWDFUND);
  }, []);

  const onCompleted = () => {
    Mixpanel.track(CROWDFUND.NEW);
  };

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });
  const { data: currencyData, loading } = useQuery(MODULES_CURRENCY_QUERY);

  const {
    data,
    isLoading: writeLoading,
    write
  } = useContractWrite({
    addressOrName: LENSHUB_PROXY,
    contractInterface: LensHubProxy,
    functionName: 'postWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  });

  const form = useZodForm({
    schema: newCrowdfundSchema,
    defaultValues: {
      recipient: currentProfile?.ownedBy
    }
  });

  const handleUpload = async (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    setUploading(true);
    try {
      const attachment = await uploadMediaToIPFS(evt.target.files);
      if (attachment[0]?.item) {
        setCover(attachment[0].item);
        setCoverType(attachment[0].type);
      }
    } finally {
      setUploading(false);
    }
  };

  const { broadcast, data: broadcastData, loading: broadcastLoading } = useBroadcast({ onCompleted });
  const [createCrowdfundTypedData, { loading: typedDataLoading }] = useMutation<Mutation>(
    CREATE_POST_TYPED_DATA_MUTATION,
    {
      onCompleted: async ({
        createPostTypedData
      }: {
        createPostTypedData: CreatePostBroadcastItemResult;
      }) => {
        try {
          const { id, typedData } = createPostTypedData;
          const {
            profileId,
            contentURI,
            collectModule,
            collectModuleInitData,
            referenceModule,
            referenceModuleInitData,
            deadline
          } = typedData?.value;
          const signature = await signTypedDataAsync(getSignature(typedData));
          const { v, r, s } = splitSignature(signature);
          const sig = { v, r, s, deadline };
          const inputStruct = {
            profileId,
            contentURI,
            collectModule,
            collectModuleInitData,
            referenceModule,
            referenceModuleInitData,
            sig
          };

          setUserSigNonce(userSigNonce + 1);
          if (RELAY_ON) {
            const {
              data: { broadcast: result }
            } = await broadcast({ request: { id, signature } });

            if ('reason' in result) {
              write?.({ recklesslySetUnpreparedArgs: inputStruct });
            }
          } else {
            write?.({ recklesslySetUnpreparedArgs: inputStruct });
          }
        } catch {}
      },
      onError
    }
  );

  const [createCrowdfundViaDispatcher, { data: dispatcherData, loading: dispatcherLoading }] = useMutation(
    CREATE_POST_VIA_DISPATHCER_MUTATION,
    { onCompleted, onError }
  );

  const createCrowdfund = async (
    title: string,
    amount: string,
    goal: string,
    recipient: string,
    referralFee: string,
    description: string | null
  ) => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }

    setIsUploading(true);
    const id = await uploadToArweave({
      version: '2.0.0',
      metadata_id: uuid(),
      description: description ? description : title,
      content: description ? description : title,
      external_url: `https://lenster.xyz/u/${currentProfile?.handle}`,
      image: cover ? cover : `https://avatar.tobi.sh/${uuid()}.png`,
      imageMimeType: coverType,
      name: title,
      mainContentFocus: PublicationMainFocus.Article,
      contentWarning: null,
      attributes: [
        {
          traitType: 'string',
          key: 'type',
          value: 'crowdfund'
        },
        {
          traitType: 'string',
          key: 'goal',
          value: goal
        }
      ],
      media: [],
      locale: 'en',
      createdOn: new Date(),
      appId: `${APP_NAME} Crowdfund`
    }).finally(() => setIsUploading(false));

    const request = {
      profileId: currentProfile?.id,
      contentURI: `https://arweave.net/${id}`,
      collectModule: {
        feeCollectModule: {
          amount: {
            currency: selectedCurrency,
            value: amount
          },
          recipient,
          referralFee: parseInt(referralFee),
          followerOnly: false
        }
      },
      referenceModule: {
        followerOnlyReferenceModule: false
      }
    };

    if (currentProfile?.dispatcher?.canUseRelay) {
      createCrowdfundViaDispatcher({ variables: { request } });
    } else {
      createCrowdfundTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request
        }
      });
    }
  };

  if (loading) {
    return <PageLoading message="Loading create crowdfund" />;
  }

  if (!currentProfile) {
    return <Custom404 />;
  }

  const isLoading =
    typedDataLoading || dispatcherLoading || isUploading || signLoading || writeLoading || broadcastLoading;

  return (
    <GridLayout>
      <Seo title={`Create Crowdfund • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsHelper heading="Create crowdfund" description="Create new decentralized crowdfund" />
      </GridItemFour>
      <GridItemEight>
        <Card>
          {data?.hash ??
          broadcastData?.broadcast?.txHash ??
          dispatcherData?.createPostViaDispatcher?.txHash ? (
            <Pending
              txHash={
                data?.hash ??
                broadcastData?.broadcast?.txHash ??
                dispatcherData?.createPostViaDispatcher?.txHash
              }
              indexing="Crowdfund creation in progress, please wait!"
              indexed="Crowdfund created successfully"
              type="crowdfund"
              urlPrefix="posts"
            />
          ) : (
            <Form
              form={form}
              className="p-5 space-y-4"
              onSubmit={({ title, amount, goal, recipient, referralFee, description }) => {
                createCrowdfund(title, amount, goal, recipient, referralFee, description);
              }}
            >
              <Input label="Title" type="text" placeholder={`${APP_NAME} DAO`} {...form.register('title')} />
              <div>
                <div className="label">Select Currency</div>
                <select
                  className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
                  onChange={(e) => {
                    const currency = e.target.value.split('-');
                    setSelectedCurrency(currency[0]);
                    setSelectedCurrencySymobol(currency[1]);
                  }}
                >
                  {currencyData?.enabledModuleCurrencies?.map((currency: Erc20) => (
                    <option key={currency.address} value={`${currency.address}-${currency.symbol}`}>
                      {currency.name}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Contribution amount"
                type="number"
                step="0.0001"
                min="0"
                max="100000"
                prefix={
                  <img
                    className="w-6 h-6"
                    height={24}
                    width={24}
                    src={getTokenImage(selectedCurrencySymobol)}
                    alt={selectedCurrencySymobol}
                  />
                }
                placeholder="5"
                {...form.register('amount')}
              />
              <Input
                label="Funding Goal"
                type="number"
                step="0.0001"
                min="0"
                max="100000"
                prefix={
                  <img
                    className="w-6 h-6"
                    height={24}
                    width={24}
                    src={getTokenImage(selectedCurrencySymobol)}
                    alt={selectedCurrencySymobol}
                  />
                }
                placeholder="420"
                {...form.register('goal')}
              />
              <Input
                label="Funds recipient"
                type="text"
                placeholder="0x3A5bd...5e3"
                {...form.register('recipient')}
              />
              <Input
                label="Referral Fee"
                helper={
                  <span>
                    When someone mirrors the crowdfund they will get some reward in percentage for referring
                    it.
                  </span>
                }
                type="number"
                placeholder="5"
                min="0"
                max="100"
                iconRight={<span>%</span>}
                {...form.register('referralFee')}
              />
              <TextArea
                label="Description"
                placeholder="Tell us something about the fundraise!"
                {...form.register('description')}
              />
              <div className="space-y-1.5">
                <div className="label">Cover Image</div>
                <div className="space-y-3">
                  {cover && (
                    <img
                      className="object-cover w-full h-60 rounded-lg"
                      height={240}
                      src={imagekitURL(getIPFSLink(cover), 'attachment')}
                      alt={cover}
                    />
                  )}
                  <div className="flex items-center space-x-3">
                    <ChooseFile onChange={(evt: ChangeEvent<HTMLInputElement>) => handleUpload(evt)} />
                    {uploading && <Spinner size="sm" />}
                  </div>
                </div>
              </div>
              <Button
                className="ml-auto"
                type="submit"
                disabled={isLoading}
                icon={isLoading ? <Spinner size="xs" /> : <PlusIcon className="w-4 h-4" />}
              >
                Create
              </Button>
            </Form>
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default NewCrowdfund;
