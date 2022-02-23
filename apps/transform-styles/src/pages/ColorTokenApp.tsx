import * as React from "react";
import {
  ColorSchemeDropdown,
  ColorTokenDropdown,
} from "../components/ColorDropdown";
import { ColorToken, ColorTokenValue } from "../components/ColorToken";
import {
  getV0ColorValues,
  v0ToV9,
  getV9ColorValues,
  getTokensFromScheme,
  unifyColor,
} from "../tokenMapping/getColorToken";
import { Divider, Header, Checkbox, Button } from "@fluentui/react-northstar";
import { Link } from "react-router-dom";

export const ColorTokenApp = () => {
  const [scheme, setScheme] = React.useState("default");
  const [token, setToken] = React.useState("foreground");

  const v0Name = `${scheme}.${token}`;
  const v0Value = getV0ColorValues({ scheme, token });
  const v9Name = v0ToV9({ scheme, token });
  const v9Value = getV9ColorValues({ scheme, token });

  return (
    <div style={{ paddingTop: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginRight: "auto",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Header as="h2" content={`v0 token ➡ v9 token`} />
        <Link to="../transform">
          <Button
            text
            content="convert tokens in styles"
            style={{ textDecoration: "underline" }}
          />
        </Link>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <ColorSchemeDropdown setSelectedScheme={setScheme} />
        <ColorTokenDropdown scheme={scheme} setSelectedToken={setToken} />
      </div>
      <ColorToken name={`v0 ${v0Name}`} value={v0Value} />
      {v9Name && <ColorToken name={`v9 ${v9Name}`} value={v9Value} />}

      <Divider style={{ height: 50 }} />
      <AllTokens scheme={scheme} />
    </div>
  );
};
ColorTokenApp.displayName = "ColorTokenApp";

// show all tokens in current scheme, provide option to toggle only the ones with different color value
export const AllTokens = ({ scheme }: { scheme: string }) => {
  const [showDiffOnly, setShowDiffOnly] = React.useState(false);

  const tokens = React.useMemo(() => {
    const allTokens = getTokensFromScheme(scheme);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {allTokens.map((token) => {
          const v0Value = getV0ColorValues({ scheme, token });
          const v9Value = getV9ColorValues({ scheme, token });
          if (showDiffOnly && isTokenSameColor(v0Value, v9Value)) {
            return <></>;
          }
          return (
            <div key={token} style={{ display: "flex", gap: 40 }}>
              <ColorToken name={`${scheme}.${token}`} value={v0Value} />
              <ColorToken name={v0ToV9({ scheme, token })} value={v9Value} />
            </div>
          );
        })}
      </div>
    );
  }, [scheme, showDiffOnly]);

  return (
    <>
      <Header
        as="h2"
        content={`Token mapping in ${scheme} scheme (light/dark/contrast): `}
      />
      <Checkbox
        toggle
        label={<span>show only tokens mapped to different colors</span>}
        onChange={() => setShowDiffOnly((v) => !v)}
      />
      {tokens}
    </>
  );
};

const isTokenSameColor = (t1: ColorTokenValue, t2: ColorTokenValue) => {
  const unifiedToken1 = {
    light: unifyColor(t1.light),
    dark: unifyColor(t1.dark),
    contrast: unifyColor(t1.contrast),
  };
  const unifiedToken2 = {
    light: unifyColor(t2.light),
    dark: unifyColor(t2.dark),
    contrast: unifyColor(t2.contrast),
  };
  return (
    unifiedToken1.light === unifiedToken2.light &&
    unifiedToken1.dark === unifiedToken2.dark &&
    unifiedToken1.contrast === unifiedToken2.contrast
  );
};
