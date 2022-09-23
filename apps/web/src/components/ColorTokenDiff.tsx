import { Popup } from "@fluentui/react-northstar";
import * as React from "react";
import {
  ColorTokenValue,
  numberOfDiffColors,
} from "../tokenMapping/colorTokenCompare";
import {
  getV9ColorValues,
  lookupv9Tokens,
} from "../tokenMapping/getColorToken";
import { ColorToken } from "./ColorToken";

export interface ColorTokenDiffProps {
  v0value: ColorTokenValue;
  v9value: ColorTokenValue;
  scheme: string;
  token: string;
}

const preventDefault = (e: React.MouseEvent) => {
  e.preventDefault();
};

export const ColorTokenDiff: React.FC<ColorTokenDiffProps> = ({
  v0value,
  v9value,
  scheme,
}) => {
  const different = numberOfDiffColors(v0value, v9value);
  if (!different) {
    return <div />;
  }
  return (
    <Popup
      trigger={
        <a href="" onClick={preventDefault} style={{ alignSelf: "center" }}>
          {different} different
        </a>
      }
      on="hover"
      content={<TokenCandidates scheme={scheme} value={v0value} />}
    />
  );
};
ColorTokenDiff.displayName = "ColorTokenDiff";

const TokenCandidates: React.FC<{
  value: ColorTokenValue;
}> = ({ value }) => {
  const candidates = lookupv9Tokens(value);
  if (candidates.length === 0) {
    return <div>No suggestions 😭</div>;
  }
  return (
    <div>
      Suggestions: 🌱
      <br />
      {candidates.map((entry) => (
        <ColorToken
          key={entry[0]}
          value={getV9ColorValues({ token: entry[0] })}
          name={`${entry[0]} ${"⭐".repeat(entry[1])}`}
        />
      ))}
    </div>
  );
};
TokenCandidates.displayName = "TokenCandidates";
