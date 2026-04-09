import { StyleSheet } from "react-native";

export const colors = {
  font: "#fff",
  primary: "#aa0093",
};

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
    color: colors.font,
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
    //backgroundColor: "red",
    width: 50,
    aspectRatio: "1/1",
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

//*------------------------------------------------------------------------------------------------------------------
//* Button
//*------------------------------------------------------------------------------------------------------------------
const button = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.font,
    fontSize: 16,
    textAlign: "center",
  },
});

export default {
  ...base,
  ...nav,
  ...button,
};
