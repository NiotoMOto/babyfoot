import React from "react";
import { Route } from "react-router-dom";
import { Header } from "./Header";

export const DefaultLayout = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={matchProps => (
        <div style={{ height: "100vh" }}>
          <Header>
            {(setTitle, setColor) => (
              <Component
                setColor={setColor}
                setTitle={setTitle}
                {...matchProps}
              />
            )}
          </Header>
        </div>
      )}
    />
  );
};
