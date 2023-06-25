import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export const DetailsScreen = (props: DetailsScreenProps) => {
  const {
    route: {}
  } = props;

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const openModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  // variables
  // const snapPoints = useMemo(() => ['25%', '50%'], [])
  const snapPoints = useMemo(() => ['40%'], []);

  return (
    <View>
      <TouchableOpacity style={{ padding: 30 }} onPress={openModal}>
        <Text>open_bottom_sheet</Text>
      </TouchableOpacity>
      <BottomSheetModal
        index={0}
        ref={bottomSheetModalRef}
        backgroundStyle={{ borderRadius: 40 }}
        style={{ marginHorizontal: 10 }}
        bottomInset={15}
        detached={true}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
      >
        <View style={{ padding: 10 }}>
          <Text>bottomsheet</Text>
        </View>
      </BottomSheetModal>
    </View>
  );
};
