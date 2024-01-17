import React from "react";

import classes from "./style.module.scss";
import Menu from "../../components/Menu";
import Button from "../../components/Button";
import Header from "../../components/Header";
import FoodCard from "../../components/FoodCard";
import Card from "../../components/Card";

const Home = () => {
  return (
    <>
      <Header />
      <Menu />
      <FoodCard />
      <Card />
    </>
  );
};

export default Home;
