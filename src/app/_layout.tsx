import { Stack, Redirect, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../constants/AuthContext";

function RootNavigation() {
  const { user, loading } = useAuth();
  const segments = useSegments();

  if (loading) return null;

  const inAuthScreen = segments[0] === "login";

  if (!user && !inAuthScreen) {
    return <Redirect href="/login" />;
  }

  if (user && inAuthScreen) {
    return <Redirect href="/timer" />;
  }

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