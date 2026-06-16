import { View, Text, Pressable, Dimensions } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { styles } from "../styles/home";

const { width } = Dimensions.get("window");

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const data = [
    {
      title: "Um timer feito para academias e personal trainers",
      text: "Crie treinos mais organizados e profissionais com um timer simples e poderoso.",
    },
    {
      title: "Sua marca dentro do treino",
      text: "Personalize o app com a logo da sua academia ou do seu serviço e passe mais profissionalismo.",
    },
    {
      title: "Mais foco, menos bagunça",
      text: "Seus alunos seguem o treino certo, sem confusão e com mais eficiência.",
    },
    {
      title: "Comece agora",
      text: "Crie sua conta em segundos e transforme a forma como você conduz treinos.",
    },
  ];

  const next = () => {
    if (step < data.length - 1) {
      setStep(step + 1);
    }
  };

  const back = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const goLogin = () => {
    router.push("/login");
  };

  return (
    <View style={styles.container}>
      {/* SLIDE */}
      <View style={[styles.slide, { width }]}>
        <Text style={styles.title}>{data[step].title}</Text>
        <Text style={styles.text}>{data[step].text}</Text>
      </View>

      {/* INDICADORES */}
      <View style={styles.dots}>
        {data.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              step === i && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* BOTÕES */}
      <View style={styles.buttons}>
        <View style={styles.row}>
          {step > 0 && (
            <Pressable style={styles.secondaryBtn} onPress={back}>
              <Text style={styles.secondaryText}>Voltar</Text>
            </Pressable>
          )}

          {step < data.length - 1 ? (
            <Pressable style={styles.primaryBtn} onPress={next}>
              <Text style={styles.primaryText}>Próximo</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.primaryBtn} onPress={goLogin}>
              <Text style={styles.primaryText}>Começar</Text>
            </Pressable>
          )}
        </View>

        <Pressable onPress={goLogin}>
          <Text style={styles.skip}>Pular introdução</Text>
        </Pressable>
      </View>
    </View>
  );
}