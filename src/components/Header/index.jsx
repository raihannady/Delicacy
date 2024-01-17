import React from "react";
import classes from "./style.module.scss";

const Header = () => {
  return (
    <>
      <nav>
        <div className={classes.header}>
          <h1>Delicacy</h1>
        </div>
      </nav>
    </>
  );
};

export default Header;
