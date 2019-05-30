import React, { useEffect } from "react";
import { ui, auth } from "../../firebaseConfig";
import { Flex } from "rebass";
import KingOfBaby from "../../assets/KingOfBaby.png";

export const Login = () => {
  useEffect(() => {
    ui.start("#auth-container", {
      signInOptions: [auth.GoogleAuthProvider.PROVIDER_ID],
      signInSuccessUrl: "/"
    });
  }, []);

  return (
    <Flex
      style={{
        height: "100vh",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }}
      width="100%"
      flexDirection="column"
      justifyContent="center">
      <Flex
        mt="-200px"
        flexDirection="row"
        alignItems="center"
        justifyContent="center">
        <img alt="king of baby" width="100%" src={KingOfBaby} />
      </Flex>
      <Flex
        mt="-200px"
        flexDirection="row"
        alignItems="center"
        justifyContent="center">
        <div id="auth-container" />
      </Flex>
    </Flex>
  );
};
