import { Button } from "@hey/ui";
import type { FC } from "react";
import { useGlobalModalStore } from "src/store/non-persisted/useGlobalModalStore";
import { useSignupStore } from "../Auth/Signup";

const SignupButton: FC = () => {
  const { setShowAuthModal } = useGlobalModalStore();
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
