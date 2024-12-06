import { Button } from "@hey/ui";
import type { FC } from "react";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";
import { useSignupStore } from "../Auth/Signup";

const SignupButton: FC = () => {
  const { setShowAuthModal } = useGlobalModalStateStore();
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
