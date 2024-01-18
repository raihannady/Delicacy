import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { callAPI } from "../../domain/api";

import classes from "./style.module.scss";
import { Link } from "react-router-dom";

const Card = ({ category }) => {
  const [data, setData] = useState([]);
  // const { id } = useParams();

  useEffect(() => {
    fetchData();
  }, [category]);

  const fetchData = async () => {
    try {
      const response = await callAPI(`/filter.php?c=${category}`, "GET");
      const slicedResponse = response?.meals?.slice(6, 12);
      setData(slicedResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error, show a user-friendly message, or retry the request.
    }
  };

  return (
    <>
      <div className={classes.container}>
        <div className={classes.title}>
          <h1>More Recipes</h1>
        </div>
        <div className={classes.cardContainer}>
          {data &&
            data.map((item, index) => (
              <Link key={index} to={`/detail/${item.idMeal}`}>
                <div className={classes.cardBehind}>
                  <div className={classes.card}>
                    <div>
                      <img src={item.strMealThumb} alt={item.strMeal} />
                    </div>
                    <div className={classes.name}>{item.strMeal}</div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};

export default Card;
