import React from "react";
import classes from "./style.module.scss";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <nav>
        <div className={classes.header}>
          <Link className={classes.link} to="/">
            <h1>Delicacy</h1>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Header;
