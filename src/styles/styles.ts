import { StyleSheet } from "react-native";

export const colors = {
  font: "#ffffff",
  fontMuted: "#888888",
  primary: "#aa0093",
  background: "#111111",
  surface: "#1c1c1c",
  surfaceElevated: "#262626",
  border: "#313131",
  imagePlaceholder: "#2a2a2a",
  danger: "#e24a4a",
} as const;

//*------------------------------------------------------------------------------------------------------------------
//* Base
//*------------------------------------------------------------------------------------------------------------------
const base = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 12,
  },
  text: {
    color: colors.font,
  },
  textMuted: {
    color: colors.fontMuted,
  },
  image: {
    backgroundColor: colors.imagePlaceholder,
    width: "100%",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
  },
  sectionHeader: {
    color: colors.fontMuted,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 20,
    paddingHorizontal: 4,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: 14,
  },
  mangaServiceItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

//*------------------------------------------------------------------------------------------------------------------
//* Navbar
//*------------------------------------------------------------------------------------------------------------------
const nav = StyleSheet.create({
  navbar: {
    width: "100%",
    backgroundColor: "#0d0d0d",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  navbarInner: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 6,
    paddingHorizontal: 8,
    gap: 4,
  },
  navbarItem: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
  },
  navbarItemText: {
    color: colors.font,
    fontSize: 11,
    textAlign: "center",
    fontWeight: "500",
  },
});

//*------------------------------------------------------------------------------------------------------------------
//* Button
//*------------------------------------------------------------------------------------------------------------------
const button = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 10,
    height: 46,
  },
  buttonGhost: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  buttonText: {
    color: colors.font,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  navButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    backgroundColor: "#ffffff18",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffffff22",
  },
});

//*------------------------------------------------------------------------------------------------------------------
//* Input
//*------------------------------------------------------------------------------------------------------------------
const input = StyleSheet.create({
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.font,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    height: 46,
  },
});

export default {
  ...base,
  ...nav,
  ...button,
  ...input,
};
