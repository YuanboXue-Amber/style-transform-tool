import * as React from "react";
import { ComponentTokenRenderer } from "./Editor";
import { VariablesContext } from "../pages/variablesContext";

export const ClickableVariablesRenderer: ComponentTokenRenderer = ({
  token,
  tokenProps,
}) => {
  const { allVariables, selectedVariables, setSelectedVariables } =
    React.useContext(VariablesContext);
  if (
    allVariables.includes(token.content) &&
    token.types[0] === "function-variable" &&
    token.types[1] === "function"
  ) {
    const handleVariableClick = () =>
      setSelectedVariables((selected) => {
        if (selected.includes(token.content)) {
          return selected.filter((v) => v !== token.content);
        } else {
          return [...selected, token.content];
        }
      });
    return (
      <span
        {...tokenProps}
        style={{
          ...tokenProps.style,
          cursor: "pointer",
          pointerEvents: "auto",
          textDecoration: "underline",
          ...(selectedVariables.includes(token.content) && {
            fontWeight: "bold",
            color: "orangeRed",
          }),
        }}
        onClick={handleVariableClick}
      />
    );
  }
  return <span {...tokenProps} />;
};
