import React, { useEffect } from "react";
import Container from "../components/Container";
import { Text } from "react-native";
import { CategoryPageProps } from "../types/navigation.type";
import Button from "../components/Button";
import { randomUUID } from "expo-crypto";
import DrizzleDB from "../db/db";

const CategoryPage: React.FC<CategoryPageProps> = () => {
  

  return (
    <Container withNavbar>
      <Text>Categories</Text>
    </Container>
  );
};

export default CategoryPage;
