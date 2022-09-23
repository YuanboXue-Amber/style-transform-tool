import { Header, Button } from "@fluentui/react-northstar";
import React from "react";
import { Link } from "react-router-dom";
import { Spinner } from "@fluentui/react-components";

export const IconMappingApp = () => {
  return (
    <div style={{ paddingTop: 20, paddingLeft: 50, paddingRight: 50 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginRight: "auto",
          justifyContent: "space-between",
          width: "100vw",
          maxWidth: "1024px",
          padding: "0 50px",
        }}
      >
        <Header as="h2" content={`v0 icon ➡ v9 icon`} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Link tabIndex={-1} to="../transform">
            <Button
              text
              content="💅 Convert styles"
              style={{ textDecoration: "underline" }}
            />
          </Link>
          <Link tabIndex={-1} to="../colors">
            <Button
              text
              content="🎨 View color mapping"
              style={{ textDecoration: "underline", marginTop: "-10px" }}
            />
          </Link>
        </div>
      </div>

      <React.Suspense fallback={<Spinner label="Loading..." />}>
        {React.createElement(
          React.lazy(() => import("../components/ReactIconGrid"))
        )}
      </React.Suspense>
    </div>
  );
};
IconMappingApp.displayName = "ColorTokenApp";
