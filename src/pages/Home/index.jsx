import React, { useState } from "react";

import classes from "./style.module.scss";
import Menu from "../../components/Menu";
import Button from "../../components/Button";
import Header from "../../components/Header";
import FoodCard from "../../components/FoodCard";
import Card from "../../components/Card";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("Beef");

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
  };

  return (
    <>
      <Header />
      <Menu onCategoryChange={handleCategoryChange} />
      <FoodCard category={selectedCategory} />
      <Card category={selectedCategory} />
    </>
  );
};

export default Home;
