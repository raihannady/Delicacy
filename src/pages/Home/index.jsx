import React from "react";

import classes from "./style.module.scss";
import Menu from "../../components/Menu";
import Button from "../../components/Button";
import Header from "../../components/Header";
import FoodDetail from "../../components/FoodDetail";
import Card from "../../components/Card";

const Home = () => {
  return (
    <>
      <Header />
      <Menu />
      <FoodDetail />
      <Card />
    </>
  );
};

export default Home;
