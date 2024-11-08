import { Colors } from "@/helpers/colors";
import normalizeFont, { windowHeight } from "@/helpers/normalize-font";
import type { FeedItem } from "@hey/lens";
import { StyleSheet, Text, View } from "react-native";
import { Actions } from "./actions";

type ItemProps = {
  item: FeedItem;
};

const height = windowHeight * 0.75;

export const Item = ({ item }: ItemProps) => {
  return (
    <View style={[styles.itemContainer, { height }]}>
      <View style={styles.itemContent}>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <Text>{item.root.__typename}</Text>
        </View>
        <Actions />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  quoteContainer: {
    padding: 15,
    borderColor: Colors.border,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 15
  },
  itemContainer: {
    width: "100%",
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  itemContent: {
    gap: 15,
    padding: 15,
    width: "100%",
    height: "100%",
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: Colors.white
  },
  itemText: {
    fontFamily: "Sans",
    fontSize: normalizeFont(14)
  },
  itemHeader: {
    gap: 10,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center"
  }
});
