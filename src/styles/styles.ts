import { StyleSheet } from "react-native";

//*------------------------------------------------------------------------------------------------------------------
//* Base
//*------------------------------------------------------------------------------------------------------------------
const base = StyleSheet.create({
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
});

//*------------------------------------------------------------------------------------------------------------------
//* Navbar
//*------------------------------------------------------------------------------------------------------------------
const nav = StyleSheet.create({
  navbar: {
    width: "100%",
    backgroundColor: "#181818",
    borderTopWidth: 1,
    borderTopColor: "#585858",
  },
  navbarInner: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    gap: 8,
  },
  navbarItem: {
    backgroundColor: "red",
    width: 50,
    aspectRatio: "1/1",
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default {
  ...base,
  ...nav,
};
