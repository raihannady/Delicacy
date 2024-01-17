import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import classes from "./style.module.scss";
import { callAPI } from "../../domain/api";

const Menu = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await callAPI("/categories.php", "GET");
      setCategories(response.categories.slice(0, 6));
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error, show a user-friendly message, or retry the request.
    }
  };

  return (
    <>
      <div className={classes.container}>
        <div>
          <ul className={classes.menu}>
            {categories &&
              categories.map((category, index) => (
                <li key={index}>
                  <Link className={classes.link}>{category.strCategory}</Link>
                </li>
              ))}
            <li>
              <Link className={classes.link} to="/favorite">
                Favorite
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Menu;
