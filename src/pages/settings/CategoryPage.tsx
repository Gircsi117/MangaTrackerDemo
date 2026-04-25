import React from "react";
import Container from "../../components/Container";
import { Text } from "react-native";
import { CategoryPageProps } from "../../types/navigation.type";

const CategoryPage: React.FC<CategoryPageProps> = () => {
  return (
    <Container withNavbar>
      <Text>Categories</Text>
    </Container>
  );
};

export default CategoryPage;
