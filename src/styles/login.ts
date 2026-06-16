import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#111",
  },

  title: {
    fontSize: 20,
    marginBottom: 10,
    color: "#fff",
    fontWeight: "bold",
  },

  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    marginBottom: 10,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },

  button: {
    backgroundColor: "black",
    padding: 14,
    borderRadius: 16,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },

  error: {
    color: "red",
    marginTop: 10,
    fontWeight: "700",
    textAlign: "center",
  },
});
