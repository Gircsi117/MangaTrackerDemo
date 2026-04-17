import React, { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import useCredentialsStore from "../stores/credentials.store";
import Button from "./Button";
import styles from "../styles/styles";
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
      text1: "Save successful",
      text2: "Successfully saved credentials!",
    });
  };

  const handleDelete = async () => {
    await deleteCredential(id);
    setEmail("");
    setPassword("");

    Toast.show({
      type: "success",
      text1: "Delete successful",
      text2: "Successfully deleted credentials!",
    });
  };

  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.text}>{name}</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Jelszó"
        placeholderTextColor="#aaa"
        secureTextEntry
        style={styles.input}
      />
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Button onPress={handleSave} style={{ marginTop: 0 }}>
          Mentés
        </Button>
        <Button
          onPress={handleDelete}
          style={{ marginTop: 0, backgroundColor: "#e24a4a" }}
        >
          Törlés
        </Button>
      </View>
    </View>
  );
};

export default CredentialSetter;
