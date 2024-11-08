import { EdgeGradient } from "@/components/shared/edge-gradient";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Link, Slot } from "expo-router";
import { Plus } from "lucide-react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FeedLayout() {
  const { bottom } = useSafeAreaInsets();

  return (
    <>
      <EdgeGradient />
      <Slot />
      <View style={{ position: "absolute", bottom, right: 10, zIndex: 1 }}>
        <Link href="/create" asChild>
          <AnimatedButton style={{ width: 55, height: 55 }}>
            <Plus size={30} color="black" />
          </AnimatedButton>
        </Link>
      </View>
    </>
  );
}
