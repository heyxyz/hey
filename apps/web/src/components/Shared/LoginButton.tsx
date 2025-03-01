import { STATIC_IMAGES_URL } from "@hey/data/constants";
import { Button } from "@hey/ui";
import cn from "@hey/ui/cn";
import type { FC, MouseEvent } from "react";
import { useAuthModalStore } from "src/store/non-persisted/modal/useAuthModalStore";

interface LoginButtonProps {
  className?: string;
  isBig?: boolean;
  isFullWidth?: boolean;
  title?: string;
}

const LoginButton: FC<LoginButtonProps> = ({
  className = "",
  isBig = false,
  isFullWidth = false,
  title = "Login"
}) => {
  const { setShowAuthModal } = useAuthModalStore();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    return setShowAuthModal(true);
  };

  return (
    <Button
      className={cn(
        isFullWidth ? "flex w-full items-center justify-center" : "",
        className
      )}
      icon={
        <img
          alt="Lens Logo"
          className="mr-0.5 h-3"
          height={12}
          src={`${STATIC_IMAGES_URL}/brands/lens.svg`}
          width={19}
        />
      }
      onClick={handleClick}
      size={isBig ? "lg" : "md"}
    >
      {title}
    </Button>
  );
};

export default LoginButton;
