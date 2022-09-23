import * as React from "react";
import {
  ColorSchemeDropdown,
  ColorTokenDropdown,
} from "../components/ColorDropdown";
import { ColorToken } from "../components/ColorToken";
import {
  getV0ColorValues,
  v0ToV9,
  getV0ToV9ColorValues,
  getTokensFromScheme,
} from "../tokenMapping/getColorToken";
import { Divider, Header, Checkbox, Button } from "@fluentui/react-northstar";
import { Link } from "react-router-dom";
import { isTokenSameColor } from "../tokenMapping/colorTokenCompare";
import { ColorTokenDiff } from "../components/ColorTokenDiff";

export const ColorTokenApp = () => {
  const [scheme, setScheme] = React.useState("default");
  const [token, setToken] = React.useState("foreground");

  const v0Name = `${scheme}.${token}`;
  const v0Value = getV0ColorValues({ scheme, token });
  const v9Name = v0ToV9({ scheme, token });
  const v9Value = getV0ToV9ColorValues({ scheme, token });

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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Link tabIndex={-1} to="../transform">
            <Button
              text
              content="💅 Convert styles"
              style={{ textDecoration: "underline" }}
            />
          </Link>
          <Link tabIndex={-1} to="../icons">
            <Button
              text
              content="🎭 View icon mapping"
              style={{ textDecoration: "underline", marginTop: "-10px" }}
            />
          </Link>
        </div>
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
          const v9Value = getV0ToV9ColorValues({ scheme, token });
          if (showDiffOnly && isTokenSameColor(v0Value, v9Value)) {
            return null;
          }
          return (
            <div key={token} style={{ display: "flex", gap: 40 }}>
              <ColorToken name={`${scheme}.${token}`} value={v0Value} />
              <ColorToken name={v0ToV9({ scheme, token })} value={v9Value} />
              <ColorTokenDiff v0value={v0Value} v9value={v9Value} />
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
