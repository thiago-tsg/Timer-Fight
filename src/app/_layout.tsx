import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useRef } from "react";
import { AuthProvider, useAuth } from "../constants/AuthContext";

function RootNavigation() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const route = segments?.[0]; // pode ser undefined
  const isIndex = !route; // 👈 INDEX REAL

  const redirectLock = useRef(false);

  const publicRoutes = ["login", "home"]; // index já está coberto por isIndex

  useEffect(() => {
    if (loading) return;
    if (redirectLock.current) return;

    // ❌ não logado tentando rota privada
    if (!user && route && !publicRoutes.includes(route)) {
      redirectLock.current = true;

      router.replace("/login");

      setTimeout(() => {
        redirectLock.current = false;
      }, 300);

      return;
    }

    // ❌ não logado no index
    if (!user && isIndex) {
      redirectLock.current = true;

      router.replace("/login");

      setTimeout(() => {
        redirectLock.current = false;
      }, 300);

      return;
    }

    // ❌ logado no login
    if (user && route === "login") {
      redirectLock.current = true;

      router.replace("/timer");

      setTimeout(() => {
        redirectLock.current = false;
      }, 300);

      return;
    }

    // ❌ logado no index
    if (user && isIndex) {
      redirectLock.current = true;

      router.replace("/timer");

      setTimeout(() => {
        redirectLock.current = false;
      }, 300);

      return;
    }
  }, [user, loading, route, isIndex]);

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