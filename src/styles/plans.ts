import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  closeButton: {
    position: "absolute",
    top: 50,
    right: 25,
    zIndex: 999,
  },

  content: {
    padding: 24,
    paddingBottom: 50,
    alignItems: "center",
  },

  pageTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "700",
    marginTop: 40,
    marginBottom: 10,
    textAlign: "center",
  },

  pageSubtitle: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    maxWidth: 500,
  },

  card: {
    width: "100%",
    maxWidth: 500,

    backgroundColor: "#f5f5f5",

    borderRadius: 24,

    padding: 25,

    marginBottom: 25,
  },

  cardHighlight: {
    borderWidth: 3,
    borderColor: "#FFD700",
  },

  badge: {
    alignSelf: "center",

    backgroundColor: "#FFD700",

    paddingHorizontal: 15,
    paddingVertical: 6,

    borderRadius: 20,

    marginBottom: 15,
  },

  badgeText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 12,
  },

  planTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },

  price: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 25,
  },

  featuresContainer: {
    marginBottom: 25,
  },

  feature: {
    fontSize: 16,
    color: "#444",
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#111",

    paddingVertical: 16,

    borderRadius: 14,

    alignItems: "center",
  },

  buttonHighlight: {
    backgroundColor: "#000",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
