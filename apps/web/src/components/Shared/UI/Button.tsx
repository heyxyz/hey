import { Button as HeyButton } from "@hey/ui";
import type { ButtonProps } from "@hey/ui/src/Button";
import type { FC } from "react";
import { useProfileThemeStore } from "src/store/persisted/useProfileThemeStore";

const Button: FC<ButtonProps> = (props) => {
  const { theme } = useProfileThemeStore();

  return (
    <HeyButton
      style={{ borderRadius: `${theme?.buttonBorderRadius}px` }}
      {...props}
    />
  );
};

export default Button;
