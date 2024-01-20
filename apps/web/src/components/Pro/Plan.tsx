import { SparklesIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { HEY_API_URL, IS_MAINNET } from '@hey/data/constants';
import { Button, Card } from '@hey/ui';
import axios from 'axios';
import { type FC, useState } from 'react';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';
import useProfileStore from 'src/store/persisted/useProfileStore';

interface PlanProps {
  buttonText: string;
  description: string;
  duration: string;
  features: string[];
  name: string;
  planId: string;
  price: number;
}

const Plan: FC<PlanProps> = ({
  buttonText,
  description,
  duration,
  features,
  name,
  planId,
  price
}) => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const isPro = usePreferencesStore((state) => state.isPro);
  const [loading, setLoading] = useState(false);
  const manageUrl = IS_MAINNET
    ? 'https://billing.stripe.com/p/login/3cs8Agc9ggY82A0000'
    : 'https://billing.stripe.com/p/login/test_9AQbLWgO68K56uk144';

  const handleSubscribe = async () => {
    if (isPro) {
      return window.open(manageUrl, '_blank');
    }

    try {
      setLoading(true);

      const response = await axios.get(`${HEY_API_URL}/stripe/session`, {
        params: { id: currentProfile?.id, plan: planId }
      });

      return location.replace(response.data.url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full p-5 shadow-sm" forceRounded>
      <div className="flex items-center space-x-3">
        <SparklesIcon className="text-brand-500 size-6" />
        <b className="text-xl">{name}</b>
      </div>
      <div className="mt-5">
        <div className="text-2xl font-bold">${price}</div>
        <div className="ld-text-gray-500 text-sm">per {duration}</div>
      </div>
      <div className="mt-5">{description}</div>
      <div className="mt-5">
        <Button
          className="w-full"
          disabled={loading}
          onClick={handleSubscribe}
          size="lg"
        >
          {isPro ? 'Manage Subscription' : buttonText}
        </Button>
      </div>
      <div className="mt-6 space-y-3 text-gray-500">
        {features.map((feature, index) => (
          <div className="flex items-center space-x-2" key={index}>
            <CheckCircleIcon className="size-5 text-green-500" />
            <div>{feature}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Plan;
