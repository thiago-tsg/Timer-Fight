import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../constants/AuthContext";

function RootNavigation() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const inAuthScreen = segments[0] === "login";

  useEffect(() => {
    if (loading) return;

    if (!user && !inAuthScreen) {
      router.replace("/login");
    }

    if (user && inAuthScreen) {
      router.replace("/timer");
    }
  }, [user, loading, segments]);

  if (loading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
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