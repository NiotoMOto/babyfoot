import React, { useEffect } from "react";
import { ui, auth } from "../../firebaseConfig";
import { Flex } from "rebass";

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
        background:
          "url(https://images.pexels.com/photos/1445651/pexels-photo-1445651.png?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }}
      width="100%"
      justifyContent="center">
      <Flex
        mt="-200px"
        flexDirection="column"
        alignItems="center"
        justifyContent="center">
        <div id="auth-container" />
      </Flex>
    </Flex>
  );
};
