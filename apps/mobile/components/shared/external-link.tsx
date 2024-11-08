import { type Href, Link } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import type { ComponentProps } from "react";
import { Platform } from "react-native";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

export const ExternalLink = ({ href, ...rest }: Props) => {
  return (
    <Link
      target="_blank"
      {...rest}
      suppressHighlighting
      href={href as Href}
      onPress={async (event) => {
        if (Platform.OS !== "web") {
          event.preventDefault();
          await openBrowserAsync(href);
        }
      }}
    />
  );
};
