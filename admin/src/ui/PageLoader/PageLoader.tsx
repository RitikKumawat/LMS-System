import { Loader } from "@mantine/core";
import React from "react";
import classes from "./index.module.scss";
const PageLoader: React.FC = () => {
  return (
    <div className={classes.container}>
      <Loader color="#3F51B5" size={40} />
    </div>
  );
};

export default PageLoader;
