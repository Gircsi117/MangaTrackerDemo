import React, { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import useCredentialsStore from "../stores/credentials.store";
import Button from "./Button";
import styles, { colors } from "../styles/styles";
import Toast from "react-native-toast-message";

type Props = {
  id: string;
  name: string;
};

const CredentialSetter: React.FC<Props> = ({ id, name }) => {
  const { get, set, delete: deleteCredential } = useCredentialsStore();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    const credential = get(id);
    if (!credential) return;

    setEmail(credential.email);
    setPassword(credential.password);
  }, []);

  const handleSave = async () => {
    await set(id, { email, password });
    Toast.show({
      type: "success",
      text1: "Sikeres mentés",
      text2: "Az adatok sikeresen el lettek mentve!",
    });
  };

  const handleDelete = async () => {
    await deleteCredential(id);
    setEmail("");
    setPassword("");

    Toast.show({
      type: "success",
      text1: "Sikeres törlés",
      text2: "Az adatok sikeresen törölve lettek!",
    });
  };

  return (
    <View style={[styles.card, { padding: 16, gap: 12 }]}>
      <Text style={[styles.text, { fontSize: 15, fontWeight: "600" }]}>{name}</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={colors.fontMuted}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Jelszó"
        placeholderTextColor={colors.fontMuted}
        secureTextEntry
        style={styles.input}
      />
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Button onPress={handleSave} style={{ flex: 1 }}>
          Mentés
        </Button>
        <Button
          onPress={handleDelete}
          style={{ flex: 0.5, backgroundColor: colors.danger }}
        >
          Törlés
        </Button>
      </View>
    </View>
  );
};

export default CredentialSetter;
