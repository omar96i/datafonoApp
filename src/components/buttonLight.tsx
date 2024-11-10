import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text, GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface CustomButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
  iconName?: string;
  style?: StyleProp<ViewStyle>;
}

const CustomButton: React.FC<CustomButtonProps> = ({ onPress, title, iconName, style }) => {
  return (
    <TouchableOpacity style={[styles.buttonContainer, style]} onPress={onPress}>
      <View style={styles.buttonContent}>
        <Text style={styles.buttonText}>{title}</Text>
        {iconName && <Icon name={iconName} size={24} color="#000428"/>}
      </View>
    </TouchableOpacity>
  );
};

const BUTTON_HEIGHT = 70;
const BORDER_RADIUS = 30;
const BUTTON_PADDING_START = 20;
const BUTTON_BORDER_COLOR = "#000428";
const BUTTON_TEXT_COLOR = "#000428";

const styles = StyleSheet.create({
  buttonContainer: {
    width: "80%",
    height: BUTTON_HEIGHT,
    paddingStart: BUTTON_PADDING_START,
    borderWidth: 1,
    borderColor: BUTTON_BORDER_COLOR,
    borderRadius: BORDER_RADIUS,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingRight: 20,
  },
  buttonText: {
    fontSize: 18,
    color: BUTTON_TEXT_COLOR,
    fontWeight: "bold",
  },
});

export default CustomButton;
