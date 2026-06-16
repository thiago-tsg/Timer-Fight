import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 32,
  },

  text: {
    fontSize: 16,
    color: "#b5b5b5",
    textAlign: "center",
    lineHeight: 22,
  },

  dots: {
    flexDirection: "row",
    marginTop: 40,
    gap: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#333",
  },

  dotActive: {
    backgroundColor: "#fff",
    width: 18,
  },

  buttons: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  primaryBtn: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
  },

  primaryText: {
    color: "#000",
    fontWeight: "700",
  },

  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },

  secondaryText: {
    color: "#fff",
    fontWeight: "500",
  },

  skip: {
    color: "#666",
    fontSize: 13,
  },
});