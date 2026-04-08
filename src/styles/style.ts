import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f1f1f",
  },
  scroll: {
    padding: 8,
  },
  text: {
    color: "#fff",
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#4a90e2",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  navbar: {
    width: "100%",
    backgroundColor: "#181818",
    borderTopWidth: 1,
    borderTopColor: "#585858",
  },
  navbarInner: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
});

export default styles;
