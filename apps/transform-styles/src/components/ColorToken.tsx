import * as React from "react";

export interface ColorTokenValue {
  light: string;
  dark: string;
  contrast: string;
}

export interface ColorTokenProps {
  name: string;
  value: ColorTokenValue;
}

export const ColorToken: React.FC<ColorTokenProps> = ({ name, value }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <p>{name}</p>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        maxWidth: 600,
        minWidth: 300,
        borderTop: "1px dotted",
        borderBottom: "1px dotted",
        borderLeft: "1px dotted",
      }}
    >
      <span style={getColorBlockStyles(value.light)}>
        {value.light.toLowerCase()}
      </span>
      <span style={getColorBlockStyles(value.dark)}>
        {value.dark.toLowerCase()}
      </span>
      <span style={getColorBlockStyles(value.contrast)}>
        {value.contrast.toLowerCase()}
      </span>
    </div>
  </div>
);
ColorToken.displayName = "ColorToken";

const getColorBlockStyles = (color: string) => {
  if (color.length < 7) {
    color =
      "#" +
      color
        .slice(1)
        .split("")
        .map((d) => d + d)
        .join("");
  }

  return {
    backgroundColor: color,
    color: getTextColor(color),
    padding: 10,
    borderRight: "1px dotted",
  };
};

const getTextColor = (bgColor: string) =>
  bgColor[0] !== "#"
    ? "#000"
    : parseInt(bgColor.replace("#", ""), 16) > 0xffffff / 2
    ? "#000"
    : "#fff";
