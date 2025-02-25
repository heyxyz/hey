import { APP_NAME, STATIC_IMAGES_URL } from "@hey/data/constants";
import { Button, Card } from "@hey/ui";
import type { FC } from "react";
import { useAuthModalStore } from "src/store/non-persisted/modal/useAuthModalStore";
import { useSignupStore } from "./Signup";

const SignupCard: FC = () => {
  const { setShowAuthModal } = useAuthModalStore();
  const { setScreen } = useSignupStore();

  const handleSignupClick = () => {
    setScreen("choose");
    setShowAuthModal(true, "signup");
  };

  return (
    <Card as="aside" className="mb-4 space-y-4 p-5">
      <img
        alt="Dizzy emoji"
        className="mx-auto size-14"
        src={`${STATIC_IMAGES_URL}/emojis/dizzy.png`}
      />
      <div className="space-y-3 text-center">
        <div className="font-bold">Get your {APP_NAME} account now!</div>
        <div>
          <Button onClick={handleSignupClick} size="lg">
            Signup now
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SignupCard;
