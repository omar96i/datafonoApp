import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text, ImageBackground, GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Definir los tipos de las props que recibirá el componente
interface CustomButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
  iconName?: string;  // iconName es opcional
  style?: StyleProp<ViewStyle>;  // Permite pasar estilos adicionales
}

const CustomButton: React.FC<CustomButtonProps> = ({ onPress, title, iconName, style }) => {
  return (
    <TouchableOpacity style={[styles.buttonContainer, style]} onPress={onPress}>
      <ImageBackground
        source={require("../assets/images/button.png")}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>{title}</Text>
          {iconName && <Icon name={iconName} size={24} color="#fff" />}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const BUTTON_HEIGHT = 70;
const BORDER_RADIUS = 30;
const BUTTON_PADDING_START = 20;

const styles = StyleSheet.create({
  buttonContainer: {
    width: "80%",
    overflow: "hidden",
    borderRadius: BORDER_RADIUS,
    marginBottom: 20,
    height: BUTTON_HEIGHT,  // Aseguramos la altura del botón aquí también
  },
  imageBackground: {
    height: "100%",  // Asegura que cubra el 100% del contenedor
    width: "100%",  // Asegura que cubra el 100% del ancho
    alignItems: "center",  // Centra el contenido horizontalmente
    borderRadius: BORDER_RADIUS,
    overflow: "hidden",
    flexDirection: "row",  // Alinea el texto y el ícono en fila
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginRight: 10,  // Añade un margen al texto para separar del icono
  },
});

export default CustomButton;
