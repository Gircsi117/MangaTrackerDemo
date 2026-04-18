import { StyleSheet } from "react-native";

export const colors = {
  font: "#fff",
  primary: "#aa0093",
} as const;

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
  image: {
    backgroundColor: "#585858",
    width: "100%",
    height: undefined,
  },
  mangaServiceItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    paddingVertical: 8,
    backgroundColor: "#585858",
    borderRadius: 8,
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
    width: 60,
    aspectRatio: "1/1",
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  navbarItemText:{
    color: colors.font,
    fontSize: 12,
    textAlign: "center",
  }
});

//*------------------------------------------------------------------------------------------------------------------
//* Button
//*------------------------------------------------------------------------------------------------------------------
const button = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
    height: 45,
  },
  buttonText: {
    color: colors.font,
    fontSize: 12,
    textAlign: "center",
  },
});

//*------------------------------------------------------------------------------------------------------------------
//* Input
//*------------------------------------------------------------------------------------------------------------------
const input = StyleSheet.create({
  input: {
    flex: 1,
    padding: 0,
    backgroundColor: "#585858",
    borderRadius: 8,
    color: colors.font,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 12,
    height: 45,
  },
});

export default {
  ...base,
  ...nav,
  ...button,
  ...input,
};
