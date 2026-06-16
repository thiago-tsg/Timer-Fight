import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../constants/AuthContext";

function RootNavigation() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const inLogin = segments[0] === "login";
  const inTimer = segments[0] === "timer";

  useEffect(() => {
    if (loading) return;

    // ❌ se não logado e tentar ir pro timer → manda login
    if (!user && inTimer) {
      router.replace("/login");
    }

    // ❌ se logado e estiver no login → manda timer
    if (user && inLogin) {
      router.replace("/timer");
    }
  }, [user, loading, segments]);

  if (loading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="login" />
      <Stack.Screen name="timer" />
    </Stack>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}