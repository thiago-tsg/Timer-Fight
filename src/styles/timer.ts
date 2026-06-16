import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  cgImg: {
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
    marginBottom: 50,
  },

  cgTimer: {
    width: "100%",
    maxWidth: 420,

    backgroundColor: "rgba(0,0,0,0.55)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",

    borderRadius: 24,
    padding: 20,
    alignItems: "center",
  },

  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
  },

  inputsRow: {
    width: "100%",
    gap: 8,
    marginBottom: 12,
  },

  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
    color: "#111827",
  },

  status: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 8,
  },

  timer: {
    color: "white",
    fontSize: 48,
    fontWeight: "900",
    marginBottom: 12,
  },

  timerDanger: {
    color: "#ef4444",
  },

  buttonsRow: {
    width: "100%",
    gap: 10,
    marginTop: 10,
  },

  buttonsRowDesktop: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  button: {
    minWidth: 150,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },

  buttonStart: {
    backgroundColor: "#1eff00af",
  },

  buttonPause: {
    backgroundColor: "#fbff00af",
  },

  buttonTextPause: {
    color: "#111827",
  },

  buttonReset: {
    backgroundColor: "#0062ffb0",
  },

  buttonLogout: {
    backgroundColor: "#ff0000",
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "800",
  },

  logoutButton: {
    backgroundColor: "#8B0000",
    padding: 14,
    borderRadius: 16,
    marginTop: 12,
  },

  containerDesktop: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 80,
  },

  cgImgDesktop: {
    marginBottom: 0,
  },

  cgTimerDesktop: {
    maxWidth: 700,
    width: 700,
  },
});
