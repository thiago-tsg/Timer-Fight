import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  Image,
  ImageBackground,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth, db } from "../constants/firebase";
import { useWindowDimensions } from "react-native";
import { Audio } from "expo-av";
import { styles } from "../styles/timer";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { logoMap } from "../constants/logoMap";

export default function Timer() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isTablet = width >= 767;
  const isDesktop = width >= 1200;

  const backgroundImage = isTablet
    ? require("../../assets/desktop.jpg")
    : require("../../assets/mobile.jpg");

  const { gymId } = useLocalSearchParams<{ gymId: string }>();

  const [gym, setGym] = useState<any>(null);
  const [plan, setPlan] = useState<string>("free");
  const [loadingPlan, setLoadingPlan] = useState(true);

  const [roundMinutes, setRoundMinutes] = useState(3);
  const [restSeconds, setRestSeconds] = useState(60);
  const [totalRounds, setTotalRounds] = useState(3);

  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [isRest, setIsRest] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const blinkAnim = useRef(new Animated.Value(1)).current;

  const piSound = useRef<Audio.Sound | null>(null);
  const bangSound = useRef<Audio.Sound | null>(null);

  const lastTickRef = useRef<number | null>(null);

  const isDangerTime = timeLeft <= 10 && timeLeft > 0;

  // =========================
  // PLAN
  // =========================
  const normalizedPlan = (plan || "free").toLowerCase();
  const isPro = normalizedPlan === "pro";

  // =========================
  // LOAD USER + PLAN
  // =========================
  useEffect(() => {
    const loadUserPlan = async () => {
      const user = auth.currentUser;

      if (!user) {
        router.replace("/login");
        return;
      }

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setGym(data);
        setPlan((data?.plan || "free").toLowerCase());
      } else {
        setPlan("free");
      }

      setLoadingPlan(false);
    };

    loadUserPlan();
  }, []);

  // =========================
  // SOUNDS
  // =========================
  useEffect(() => {
    const loadSounds = async () => {
      const { sound: pi } = await Audio.Sound.createAsync(
        require("../../assets/pi.mp3"),
      );

      const { sound: bang } = await Audio.Sound.createAsync(
        require("../../assets/bong.mp3"),
      );

      piSound.current = pi;
      bangSound.current = bang;
    };

    loadSounds();

    return () => {
      piSound.current?.unloadAsync();
      bangSound.current?.unloadAsync();
    };
  }, []);

  const playPi = async () => {
    try {
      await piSound.current?.stopAsync();
      await piSound.current?.setPositionAsync(0);
      await piSound.current?.playAsync();
    } catch {}
  };

  const playBang = async () => {
    try {
      await bangSound.current?.stopAsync();
      await bangSound.current?.setPositionAsync(0);
      await bangSound.current?.playAsync();
    } catch {}
  };

  // =========================
  // PROTECTION LAYER (IMPORTANTE)
  // =========================
  const requirePro = (action: () => void) => {
    if (loadingPlan) return;

    if (!isPro) {
      router.push({
        pathname: "/plans",
        params: { gymId },
      });
      return;
    }

    action();
  };

  // =========================
  // TIMER ACTIONS
  // =========================
  const startTimer = () => {
    requirePro(() => {
      if (isRunning) return;

      setCurrentRound(1);
      setIsRest(false);
      setTimeLeft(roundMinutes * 60);
      setIsRunning(true);

      playBang();
    });
  };

  const togglePause = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setIsRunning(false);
    setIsRest(false);
    setCurrentRound(1);
    setTimeLeft(0);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.log("Erro ao sair:", error);
    }
  };

  // =========================
  // TIMER ENGINE
  // =========================
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) return prev - 1;

        if (!isRest) {
          playBang();

          if (currentRound < totalRounds) {
            setIsRest(true);
            return restSeconds;
          }

          setIsRunning(false);

          Alert.alert(
            "Treino finalizado",
            "Parabéns, todos os rounds foram concluídos.",
          );

          return 0;
        }

        playBang();

        setCurrentRound((r) => r + 1);
        setIsRest(false);

        return roundMinutes * 60;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isRest, currentRound, restSeconds, roundMinutes, totalRounds]);

  // =========================
  // WARNING BEEP
  // =========================
  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) return;

    if (timeLeft <= 10) {
      if (lastTickRef.current !== timeLeft) {
        lastTickRef.current = timeLeft;
        playPi();
      }
    }
  }, [timeLeft, isRunning]);

  // =========================
  // BLINK ANIMATION
  // =========================
  useEffect(() => {
    if (!isDangerTime) {
      blinkAnim.stopAnimation();
      blinkAnim.setValue(1);
      return;
    }

    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );

    anim.start();
    return () => anim.stop();
  }, [isDangerTime]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // =========================
  // LOG DEBUG
  // =========================
  useEffect(() => {
    console.log("PLAN =>", plan);
    console.log("LOADING =>", loadingPlan);
    console.log("IS PRO =>", isPro);
  }, [plan, loadingPlan]);

  const gymKey = Array.isArray(gymId)
    ? gymId[0]
    : typeof gymId === "string"
      ? gymId
      : "";

  const logo = logoMap[gymKey] || logoMap.default;

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={[styles.container, isDesktop && styles.containerDesktop]}
    >
      <View style={styles.cgImg}>
        <Image
          source={logo}
          style={{
            width: isDesktop ? 450 : isTablet ? 300 : 200,
            height: isDesktop ? 450 : isTablet ? 300 : 200,
          }}
          resizeMode="contain"
        />
      </View>

      <View style={styles.cgTimer}>
        <Text style={styles.title}>Timer de Treino</Text>

        <View style={styles.inputsRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Minutos</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(roundMinutes)}
              onChangeText={(t) => setRoundMinutes(Number(t) || 0)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descanso</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(restSeconds)}
              onChangeText={(t) => setRestSeconds(Number(t) || 0)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Rounds</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(totalRounds)}
              onChangeText={(t) => setTotalRounds(Number(t) || 0)}
            />
          </View>
        </View>

        <Text style={styles.status}>
          {isRest ? "Descanso" : `Round ${currentRound}`}
        </Text>

        <Animated.Text
          style={[
            styles.timer,
            isDangerTime && styles.timerDanger,
            { opacity: blinkAnim },
          ]}
        >
          {formatTime(timeLeft)}
        </Animated.Text>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonStart,
              (!isPro || loadingPlan) && { opacity: 0.4 },
            ]}
            onPress={startTimer}
            disabled={loadingPlan || !isPro}
          >
            <Text style={styles.buttonText}>Iniciar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonPause]}
            onPress={togglePause}
          >
            <Text style={styles.buttonText}>
              {isRunning ? "Pausar" : "Continuar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonReset]}
            onPress={resetTimer}
          >
            <Text style={styles.buttonText}>Reiniciar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonLogout]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
