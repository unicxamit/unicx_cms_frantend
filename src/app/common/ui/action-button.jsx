function ActionButton({
  as: Component = "button",
  variant = "default",
  className = "",
  children,
  ...rest
}) {
  const variantClass =
    variant === "liquid-glass" ? "liquid-glass-btn" : "";

  const classes = [className, variantClass].filter(Boolean).join(" ");

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
}

export default ActionButton;
