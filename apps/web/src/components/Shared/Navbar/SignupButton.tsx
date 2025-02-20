import { Button } from "@hey/ui";
import type { FC } from "react";
import { useAuthModalStore } from "src/store/non-persisted/modal/useAuthModalStore";
import { useSignupStore } from "../Auth/Signup";

const SignupButton: FC = () => {
  const { setShowAuthModal } = useAuthModalStore();
  const { setScreen } = useSignupStore();

  return (
    <Button
      onClick={() => {
        setScreen("choose");
        setShowAuthModal(true, "signup");
      }}
      outline
      size="md"
    >
      Signup
    </Button>
  );
};

export default SignupButton;
