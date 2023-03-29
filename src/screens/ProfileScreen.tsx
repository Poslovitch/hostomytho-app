import React from "react";
import { View, Text } from "react-native";
import { useTailwind } from "tailwind-rn";
import PrimaryButton from "components/PrimaryButton";

const ProfileScreen = ({}) => {
  const tw = useTailwind();

  return (
    <View style={tw("flex-1 justify-center items-center")}>
      <Text style={tw("font-semibold ")}>Profile Screen</Text>
      <PrimaryButton title="Menu principal" destination="Main" />
    </View>
  );
};

export default ProfileScreen;
