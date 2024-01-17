import React from "react";
import FoodDetail from "../../components/FoodDetail";
import Header from "../../components/Header";
import classes from "./style.module.scss";

const Detail = () => {
  return (
    <>
      <Header />
      <div className={classes.detail}>
        <FoodDetail />
      </div>
    </>
  );
};

export default Detail;
