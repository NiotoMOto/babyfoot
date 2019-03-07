import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { Paper, Avatar, Typography } from "@material-ui/core";
import { UserContext } from "../../App";

export function ProfilPage({ match }) {
  console.log(match.params.id);
  const userId = match.params.id;
  const [user, setUser] = useState(null);
  useEffect(() => {
    db.collection("users")
      .doc(userId)
      .get({ source: "cache" })
      .then(doc => {
        setUser(doc.data());
      });
  }, []);
  return (
    <UserContext.Consumer>
      {me => (
        <div
          style={{
            margin: "10px",
            marginTop: "30px",
            boxShadow:
              "0 16px 38px -12px rgba(0, 0, 0, 0.56), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);"
          }}>
          {user && (
            <Paper style={{ paddingBottom: "40px", position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  textAlign: "center",
                  top: "-20px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center"
                }}>
                <Avatar
                  src={user.photoURL}
                  style={{
                    margin: 0
                  }}
                />
              </div>
              <div style={{ paddingTop: "30px" }}>
                <Typography style={{ textAlign: "center" }} variant="h6">
                  {user.displayName}
                </Typography>
              </div>
            </Paper>
          )}
        </div>
      )}
    </UserContext.Consumer>
  );
}
