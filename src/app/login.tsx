import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "../constants/firebase";
import { doc, getDoc } from "firebase/firestore";
import { router } from "expo-router";
import { styles } from "../styles/login";
import { AntDesign } from "@expo/vector-icons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);

      const uid = result.user.uid;

      const snap = await getDoc(doc(db, "users", uid));

      if (!snap.exists()) {
        setError("Usuário não cadastrado no sistema.");
        return;
      }

      const gymId = snap.data()?.gymId;

      router.replace({
        pathname: "/timer",
        params: { gymId },
      });
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login com Google");
    }
  };

  const handleLogin = async () => {
    setError("");

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      const snap = await getDoc(doc(db, "users", uid));

      if (!snap.exists()) {
        setError("Usuário não encontrado.");
        return;
      }

      const gymId = snap.data()?.gymId;

      if (!gymId) {
        setError("Usuário sem gymId.");
        return;
      }

      router.replace({
        pathname: "/timer",
        params: { gymId },
      });
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/logo-bg.png")} style={styles.logo} />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleGoogleLogin} style={styles.googleButton}>
        <AntDesign name="google" size={20} color="#111" />
        <Text style={[styles.googleText, { marginLeft: 10 }]}>
          Entrar com Google
        </Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}
