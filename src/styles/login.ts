import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#0B0B0F",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  logo: {
    width: 250,
    height: 250,
    alignSelf: "center",
    marginBottom: 24,
    resizeMode: "contain",
  },

  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#6C5CE7",
    padding: 14,
    borderRadius: 14,
    marginTop: 8,
    shadowColor: "#6C5CE7",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "800",
  },

  googleButton: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10, // ajuda no layout
  },

  googleText: {
    color: "#111",
    textAlign: "center",
    fontWeight: "800",
  },

  error: {
    color: "#FF4D4D",
    marginTop: 14,
    fontWeight: "700",
    textAlign: "center",
  },
});
