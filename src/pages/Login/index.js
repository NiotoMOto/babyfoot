import React, { useEffect } from "react";
import loginbg from "../../assets/loginbg.jpg";
import { ui, auth } from "../../firebaseConfig";
import Typography from "@material-ui/core/Typography";

export const Login = () => {
  useEffect(() => {
    ui.start("#auth-container", {
      signInOptions: [auth.GoogleAuthProvider.PROVIDER_ID],
      signInSuccessUrl: "/"
    });
  }, []);
  return (
    <div style={{ height: "100%" }}>
      <div
        style={{
          padding: "10px",
          backgroundImage: `url(${loginbg})`,
          height: "100%",
          backgroundPosition: "center",
          backgroundSize: "cover",
          filter: "blur(4px)",
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          zIndex: -3
        }}
      />
      <div
        style={{
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          height: "100%"
        }}>
        <Typography
          style={{
            textAlign: "center",
            marginTop: "30px",
            color: "white",
            fontFamily: "auto"
          }}
          variant="h2">
          King of baby
        </Typography>
        <div id="auth-container" />
      </div>
    </div>
  );
};
