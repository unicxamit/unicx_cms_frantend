import React from "react";
import "./Skeleton.css";

function Skeleton({ width = "100%", height = "16px", className = "", circle = false, style = {} }) {
  const classes = `skeleton ${circle ? "skeleton-circle" : ""} ${className}`.trim();

  return <div className={classes} style={{ width, height, ...style }} aria-hidden="true" />;
}

export default Skeleton;
