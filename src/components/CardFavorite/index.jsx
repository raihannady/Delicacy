import React from "react";
import { useState, useEffect } from "react";
import { callAPI2 } from "../../domain/api2";

import classes from "./style.module.scss";

const CardFavorite = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await callAPI2("/favorite", "GET");
      setData(response);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error, show a user-friendly message, or retry the request.
    }
  };

  return (
    <>
      <div className={classes.container}>
        <div className={classes.cardContainer}>
          {data &&
            data.map((data, index) => (
              <div key={index} className={classes.cardBehind}>
                <div className={classes.card}>
                  <div>
                    <img src={data.image} alt="" />
                  </div>
                  <div>{data.title}</div>
                  <button
                    onClick={() => {
                      callAPI2(`/favorite/${data.id}`, "DELETE"),
                        window.location.reload();
                      alert("Favorite Removed");
                    }}
                  >
                    Remove Favorite
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default CardFavorite;
