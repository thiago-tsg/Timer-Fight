import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { styles } from "../styles/plans";
import { AntDesign } from "@expo/vector-icons";

type Plan = {
  name: string;
  price: string;
  highlight?: boolean;
  features: string[];
};

export default function Plans() {
  const router = useRouter();

  // 🔥 ESSENCIAL: manter contexto da academia
  const { gymId } = useLocalSearchParams<{ gymId: string }>();

  const plans: Plan[] = [
    {
      name: "Básico",
      price: "R$ 19,90/mês",
      features: [
        "Timer profissional",
        "Logo da academia",
        "Atualizações do app",
      ],
    },
    {
      name: "Profissional",
      price: "R$ 29,90/mês",
      highlight: true,
      features: [
        "Tudo do Básico",
        "Maior personalização",
        "Novos recursos premium",
        "Suporte prioritário",
      ],
    },
  ];

  // =========================
  // 🔥 FIX: proteger gymId
  // =========================
  const safeGymId = Array.isArray(gymId)
    ? gymId[0]
    : typeof gymId === "string"
      ? gymId
      : "";

  const selectPlan = (planName: string) => {
    console.log("Plano escolhido:", planName);

    router.replace({
      pathname: "/timer",
      params: { gymId: safeGymId }, // 🔥 nunca perde contexto
    });
  };

  const goBack = () => {
    router.replace({
      pathname: "/timer",
      params: { gymId: safeGymId }, // 🔥 garante Timer nunca quebra
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* X FECHAR */}
      <TouchableOpacity style={styles.closeButton} onPress={goBack}>
        <AntDesign name="close" size={28} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.pageTitle}>Escolha seu plano</Text>

      <Text style={styles.pageSubtitle}>
        Use o timer com a identidade da sua academia.
      </Text>

      {plans.map((plan) => (
        <View
          key={plan.name}
          style={[styles.card, plan.highlight && styles.cardHighlight]}
        >
          {plan.highlight && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>MAIS ESCOLHIDO</Text>
            </View>
          )}

          <Text style={styles.planTitle}>{plan.name}</Text>

          <Text style={styles.price}>{plan.price}</Text>

          <View style={styles.featuresContainer}>
            {plan.features.map((feature) => (
              <Text key={feature} style={styles.feature}>
                ✓ {feature}
              </Text>
            ))}
          </View>

          <Pressable
            style={[styles.button, plan.highlight && styles.buttonHighlight]}
            onPress={() => selectPlan(plan.name)}
          >
            <Text style={styles.buttonText}>Contratar Plano</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}
