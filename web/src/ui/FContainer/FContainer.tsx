import React, { ReactNode } from 'react';
import classes from "./index.module.scss";
type FContainerProps = {
    children: ReactNode;
};

const FContainer = ({ children }: FContainerProps) => {
    return <div className={classes.container}>{children}</div>;
};

export default FContainer;