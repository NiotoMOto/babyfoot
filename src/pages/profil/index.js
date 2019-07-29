import React, { useEffect, useState, Fragment } from "react";
import { db } from "../../firebaseConfig";
import { map } from "lodash";
import { Paper, Avatar, Typography } from "@material-ui/core";
import { UserContext } from "../../App";
import { ProfileStats } from "./ProfilStats";
import { Badges } from "../../components/Badges";

const DisplayGroup = ({ groupId }) => {
  const [group, setgroup] = useState({});
  useEffect(
    () => {
      if (groupId) {
        db.collection("groups")
          .doc(groupId)
          .get({ source: 'cache'})
          .then(doc => setgroup(doc.data()));
      }
    },
    [groupId]
  );
  return <span>{group.name}</span>;
};

export function ProfilPage({ match }) {
  const userId = match.params.id;
  const [user, setUser] = useState(null);
  useEffect(() => {
    db.collection("users")
      .doc(userId)
      .get()
      .then(doc => {
        setUser(doc.data());
      });
  }, []);
  return (
    <UserContext.Consumer>
      {me => (
        <Fragment>
          <div
            style={{
              margin: "10px",
              marginTop: "30px"
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
                      margin: 0,
                      boxShadow:
                        " 0 16px 38px -12px rgba(0, 0, 0, 0.56), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
                    }}
                  />
                </div>
                <div style={{ paddingTop: "30px" }}>
                  <Typography
                    style={{ textAlign: "center", marginBottom: "5px" }}
                    variant="h6">
                    {user.displayName} {me.uid === user.uid ? "( vous )" : ""}
                  </Typography>
                </div>
                {map(me.stats, (state, groupId) => (
                  <div style={{ paddingTop: "30px" }}>
                    <Typography
                      style={{ textAlign: "center", marginBottom: "5px" }}
                      variant="h6">
                      <DisplayGroup groupId={groupId} />
                    </Typography>
                    <div>
                      <Badges wins={user[groupId] ? user[groupId].wins : {}} />
                    </div>
                    {user.stats && me.stats && (
                      <ProfileStats
                        user={user}
                        currentUser={me}
                        groupId={groupId}
                      />
                    )}
                  </div>
                ))}
              </Paper>
            )}
          </div>
        </Fragment>
      )}
    </UserContext.Consumer>
  );
}
