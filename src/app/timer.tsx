import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  Image,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../constants/firebase";
import { useWindowDimensions } from "react-native";
import { Audio } from "expo-av";
import { styles } from "../styles/timer";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../constants/firebase";
import { logoMap } from "../constants/logoMap";
import { ImageBackground } from "react-native";

export default function Timer() {
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  const isDesktop = width >= 1200;
  const backgroundImage = isTablet
    ? require("../../assets/desktop.jpg")
    : require("../../assets/mobile.jpg");
  const { gymId } = useLocalSearchParams<{ gymId: string }>();

  const [gym, setGym] = useState<any>(null);

  const [roundMinutes, setRoundMinutes] = useState(3);
  const [restSeconds, setRestSeconds] = useState(60);
  const [totalRounds, setTotalRounds] = useState(3);

  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [isRest, setIsRest] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const blinkAnim = useRef(new Animated.Value(1)).current;

  // 🔊 SOUNDS
  const piSound = useRef<Audio.Sound | null>(null);
  const bangSound = useRef<Audio.Sound | null>(null);

  // 🔥 controle PI por segundo
  const lastTickRef = useRef<number | null>(null);

  const isDangerTime = timeLeft <= 10 && timeLeft > 0;

  // 🔥 LOAD GYM
  useEffect(() => {
    const loadGym = async () => {
      if (!gymId) return;

      const ref = doc(db, "gyms", gymId as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setGym(snap.data());
      } else {
        setGym({ id: gymId });
      }
    };

    loadGym();
  }, [gymId]);

  // 🔊 LOAD AUDIO
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

  // 📸 LOGO
  const gymKey = Array.isArray(gymId) ? gymId[0] : gymId;
  const logo = logoMap[gymKey] || logoMap.default;

  // 🔴 BLINK
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

  // 🔥 START
  const startTimer = () => {
    if (isRunning) return;

    setCurrentRound(1);
    setIsRest(false);
    setTimeLeft(roundMinutes * 60);
    setIsRunning(true);

    playBang(); // início treino
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

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja sair e voltar para o login?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        onPress: async () => {
          try {
            console.log("ANTES", auth.currentUser);

            await signOut(auth);

            console.log("DEPOIS", auth.currentUser);
          } catch (error) {
            console.log("ERRO SIGNOUT", error);
          }
        },
      },
    ]);
  };

  // 🔥 TIMER LOOP
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) return prev - 1;

        // 🔥 FIM DO ROUND
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

        // 🔥 FIM DO DESCANSO → NOVO ROUND
        playBang();

        setCurrentRound((r) => r + 1);
        setIsRest(false);

        // 💥 BANG no início do round também
        setTimeout(() => playBang(), 50);

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

  // 🔊 PI 1x POR SEGUNDO NOS 10s FINAIS
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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={[styles.container, isDesktop && styles.containerDesktop]}
    >
      <View style={[styles.cgImg, isDesktop && styles.cgImgDesktop]}>
        <Image
          source={logo}
          style={{
            width: isDesktop ? 450 : isTablet ? 300 : 200,
            height: isDesktop ? 450 : isTablet ? 300 : 200,
          }}
          resizeMode="contain"
        />
      </View>

      <View style={[styles.cgTimer, isDesktop && styles.cgTimerDesktop]}>
        <Text style={styles.title}>Timer de Treino</Text>

        <View style={styles.inputsRow}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(roundMinutes)}
            onChangeText={(t) => setRoundMinutes(Number(t) || 0)}
          />

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(restSeconds)}
            onChangeText={(t) => setRestSeconds(Number(t) || 0)}
          />

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(totalRounds)}
            onChangeText={(t) => setTotalRounds(Number(t) || 0)}
          />
        </View>

        <Text style={styles.status}>
          {isRest ? "Descanso" : `Round ${currentRound}`}
        </Text>

        <Animated.Text
          style={[
            styles.timer,
            isTablet && { fontSize: 90 },
            isDesktop && { fontSize: 140 },
            isDangerTime && styles.timerDanger,
            { opacity: blinkAnim },
          ]}
        >
          {formatTime(timeLeft)}
        </Animated.Text>

        <View
          style={[styles.buttonsRow, isDesktop && styles.buttonsRowDesktop]}
        >
          <TouchableOpacity
            style={[styles.button, styles.buttonStart]}
            onPress={startTimer}
          >
            <Text style={styles.buttonText}>Iniciar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonPause]}
            onPress={togglePause}
          >
            <Text style={[styles.buttonText, styles.buttonTextPause]}>
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
            onPress={async () => {
              await signOut(auth);
            }}
          >
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
