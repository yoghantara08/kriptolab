import React from "react";

import classNames from "classnames";

import { TitleProps } from "./MainTitle";

const SubTitle = ({ id, children, className }: TitleProps) => {
  return (
    <h3
      id={id}
      className={classNames("mb-2 text-lg text-textPrimary", className)}
    >
      {children}
    </h3>
  );
};

export default SubTitle;
