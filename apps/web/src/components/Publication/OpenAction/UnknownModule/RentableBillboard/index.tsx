import type { FC } from 'react';

import {
  DEFAULT_COLLECT_TOKEN,
  REWARDS_ADDRESS,
  ZERO_ADDRESS
} from '@good/data/constants';
import stopEventPropagation from '@good/helpers/stopEventPropagation';
import {
  type MirrorablePublication,
  type UnknownOpenActionModuleSettings,
  useModuleMetadataQuery
} from '@good/lens';
import { Card } from '@good/ui';
import errorToast from '@helpers/errorToast';
import toast from 'react-hot-toast';
import { CHAIN } from 'src/constants';
import useActOnUnknownOpenAction from 'src/hooks/useActOnUnknownOpenAction';
import { encodeAbiParameters, parseEther } from 'viem';

import ActionButton from './ActionButton';

interface RentableBillboardOpenActionProps {
  module: UnknownOpenActionModuleSettings;
  publication?: MirrorablePublication;
}

const RentableBillboardOpenAction: FC<RentableBillboardOpenActionProps> = ({
  module,
  publication
}) => {
  const { actOnUnknownOpenAction } = useActOnUnknownOpenAction({
    onSuccess: () => {},
    signlessApproved: module.signlessApproved,
    successToast: "You've successfully swapped!"
  });

  const { data: moduleMetadata } = useModuleMetadataQuery({
    skip: !Boolean(module?.contract.address),
    variables: { request: { implementation: module?.contract.address } }
  });

  const metadata = moduleMetadata?.moduleMetadata?.metadata;

  const act = async () => {
    const abi = JSON.parse(metadata?.processCalldataABI);

    if (!metadata) {
      return toast.error('Failed to load module metadata');
    }

    const data = {
      adContentUri: '',
      adPubId: '0x01',
      clientAddress: REWARDS_ADDRESS,
      costPerSecond: parseEther('0.5'),
      duration: 600,
      merkleProof: [
        '0x7116204ecb1448ebab7c0a4f14bb851ab0891f80400863120ea9f4e69c1b0df9',
        '0xf897fcbc0d26d310c50aeaf682f36e7a699010b8e921fe378bf29e4f30774903',
        '0x64619b866fc8f041fae69fca89835fcbbc0d311e01e52ee7ed2564f4926fc2c5',
        '0x8bf5c09f8aa0da579702a98f03a8a75a424f75b3bb7a055d8d3a2a54d8fcb8da',
        '0xcfccc565420dca2f8465b47a1fbfdd18aa00bf02fbfd2e5e80150727e59f2f0d',
        '0x9525724b53465164718135e6fd830862cc0bfd31d246bda9bb9ca2b86ed50694',
        '0xdf5337865f65f3b6ec06ffd190ed315c5570cfd6691bd67b4ff613122588f569',
        '0x4cf376a8b755dae5852c40b5cd9fd53e7bd717898d5b93f8c55ff5467e37c716',
        '0xa251b843ea3c8757adfb156ba3a6d44ddca04a8d995876a9cf57a7b887b64a14',
        '0x4ecc6bb3b706f29dcf48af3935c2ede7f20d68d0f2a320acfe22f25129a3dc98',
        '0xe1d8632c379ab3fbe418d233636285669b19aae108f60f67411b6b9b00f9afc5',
        '0xb92c459dd352a51c1113c46a1c7ec5de6e23bbce78e6dd912a2cbafe4ee4476f'
      ],
      merkleProofIndex: 1467,
      openActionModule: ZERO_ADDRESS
    };

    const calldata = encodeAbiParameters(abi, [
      data.adPubId,
      data.duration,
      data.costPerSecond,
      data.merkleProofIndex,
      data.clientAddress,
      data.openActionModule,
      data.adContentUri,
      data.merkleProof
    ]);

    if (!publication) {
      return toast.success('Publish this publication to rent!');
    }

    try {
      return await actOnUnknownOpenAction({
        address: module.contract.address,
        data: calldata,
        publicationId: publication.id
      });
    } catch (error) {
      errorToast(error);
    }
  };

  return (
    <Card
      className="space-y-4 p-10 text-center"
      forceRounded
      onClick={stopEventPropagation}
    >
      <div>
        <b>
          This post space is available for rent! Rent now to promote your post.
        </b>
      </div>
      <ActionButton
        act={act}
        module={module}
        moduleAmount={{
          asset: {
            contract: { address: DEFAULT_COLLECT_TOKEN, chainId: CHAIN.id },
            decimals: 18,
            name: 'WMATIC',
            symbol: 'WMATIC'
          },
          value: '0.5'
        }}
        title="Rent now"
      />
    </Card>
  );
};

export default RentableBillboardOpenAction;
