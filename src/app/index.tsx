import { View, Image, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../constants/AuthContext";

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // valor da animação
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // animação do fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      if (user) {
        router.replace("/timer");
      } else {
        router.replace("/home");
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [user, loading]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
      }}
    >
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image
          source={require("../../assets/logo-bg.png")}
          style={{ width: 250, height: 250, resizeMode: "contain" }}
        />
      </Animated.View>
    </View>
  );
}