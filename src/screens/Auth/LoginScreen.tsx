import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  TextInputProps,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api"; // Asegúrate de que esta ruta sea correcta
import ButtonDark from "../../components/buttonDark";

// Tipo de las propiedades del componente LabeledInput
interface LabeledInputProps extends TextInputProps {
  label: string;
  isPassword?: boolean;
  passwordVisible?: boolean;
  onTogglePassword?: () => void;
}

// Componente reutilizable para Input con Label
const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  placeholder,
  isPassword = false,
  passwordVisible,
  onTogglePassword,
  ...rest
}) => {
  return (
    <View style={styles.labeledInputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor='#aaa'
          style={[styles.input, isPassword && { flex: 1 }]}
          secureTextEntry={isPassword && !passwordVisible}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity onPress={onTogglePassword}>
            <Icon
              name={passwordVisible ? "visibility" : "visibility-off"}
              size={24}
              color='#aaa'
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const LoginScreen: React.FC = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState(""); // Estado para el email
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const [error, setError] = useState(""); // Estado para manejar errores
  const [isLoading, setIsLoading] = useState(false); // Estado para el spinner

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      const { user, token } = response.data;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("password", password);
      navigation.replace("Home"); // Navegar a la página de inicio
    } catch (err) {
      Alert.alert("Credenciales inválidas", "Intenta de nuevo o registrate.");
    } finally {
      setIsLoading(false); // Ocultar el spinner cuando termine la petición
    }
  };

  const handleToRestorePassword = () => {
    navigation.navigate("RestorePassword");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Imagen dentro del ScrollView para que sea desplazable */}
        <ImageBackground
          source={require("../../assets/images/header_3.png")}
          style={styles.header}
          resizeMode='cover'
        />

        <View style={styles.formContainer}>
          <Text style={styles.loginTitle}>Ingreso</Text>

          {/* Campo de Email */}
          <LabeledInput
            label='Email'
            value={email}
            onChangeText={setEmail} // Actualiza el estado del email
            placeholder='Introduce tu email'
            keyboardType='email-address'
          />

          {/* Campo de Contraseña */}
          <LabeledInput
            label='Contraseña'
            value={password}
            onChangeText={setPassword} // Actualiza el estado de la contraseña
            placeholder='Introduce tu contraseña'
            isPassword
            passwordVisible={passwordVisible}
            onTogglePassword={() => setPasswordVisible(!passwordVisible)}
          />

          {/* Mostrar mensaje de error */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity>
            <Text
              style={styles.forgotPassword}
              onPress={handleToRestorePassword}
            >
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonWrapper}>
          {/* Spinner que aparece cuando la petición está cargando */}
          {isLoading ? (
            <ActivityIndicator size='large' color='#000' />
          ) : (
            <ButtonDark
              onPress={handleLogin}
              title='Ingresar'
              iconName='arrow-forward'
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  buttonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  header: {
    width: "100%",
    height: 350,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  labeledInputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#aaa",
    paddingBottom: 5,
  },
  input: {
    fontSize: 16,
    color: "#000",
    flex: 1,
    paddingVertical: 10,
  },
  forgotPassword: {
    color: "#000",
    fontSize: 14,
    textAlign: "left",
    marginBottom: 40,
  },
  errorText: {
    color: "red",
    marginBottom: 20,
  },
});

export default LoginScreen;
