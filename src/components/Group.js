import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { TextField, Card, CardActions, Typography } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { orderBy } from "lodash";
import { CardContent, CardHeader } from "semantic-ui-react";
import dayjs from "dayjs";
import { User } from "./User";

export const Group = ({ group, history, modeAdmin }) => {
  const currentWeek = dayjs().week();
  const currentYear = dayjs().year();
  const [newGroup, setNewgroup] = useState(group);
  const [king, setKing] = useState({});

  // useEffect(() => {
  //   db.collection("");
  // }, []);

  useEffect(() => {
    db.collection("weeks")
      .where("group", "==", db.collection("groups").doc(group.id))
      .where("week", "==", dayjs().week() - 1 ? dayjs().week() - 1 : 52)
      .get()
      .then(result => {
        if (!result.empty) {
          setKing(
            orderBy(
              result.docs.map(d => d.data().stats)[0],
              "points",
              "desc"
            )[0]
          );
        }
      });
  }, []);

  const removeGroup = id => {
    db.collection("groups")
      .doc(id)
      .delete();
  };

  const handlePointsChanges = (e, field) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    setNewgroup({
      ...group,
      points: {
        ...group.points,
        [field]: value
      }
    });
  };

  const updateGroup = () => {
    db.collection("groups")
      .doc(group.id)
      .update(newGroup);
  };
  console.log("king", king);
  return (
    <Card
      style={{ margin: "10px", padding: "20px" }}
      onClick={() => {
        if (!modeAdmin) {
          history.push(`matchs/${group.id}/${currentYear}/${currentWeek}`);
        }
      }}
    >
      <CardHeader>
        <Typography
          style={{ textAlign: "center", color: "#0d47a1" }}
          variant="h4"
        >
          {group.name}
        </Typography>
      </CardHeader>
      <CardContent>
        <div style={{ textAlign: "center", color: "#C98910" }}>
          <Typography variant="h6">King</Typography>
          {king && (
            <User
              disableLink
              variant="or"
              docRef={king.docRef}
              currenGroup={group.id}
            />
          )}
        </div>
        <div style={{ textAlign: "center", color: "#f44336" }}>
          <Typography variant="h6">Prince</Typography>
          {group && (
            <User
              disableLink
              variant="prince"
              docRef={group.prince}
              currenGroup={group.id}
            />
          )}
        </div>
        {modeAdmin && newGroup.points && (
          <div>
            <TextField
              onChange={e => handlePointsChanges(e, "but")}
              value={newGroup.points.but}
              type="number"
              label="points par buts"
            />
            <TextField
              onChange={e => handlePointsChanges(e, "ideal")}
              value={newGroup.points.ideal}
              type="number"
              label="nombre de matchs idéals"
            />
            <TextField
              onChange={e => handlePointsChanges(e, "victory")}
              value={newGroup.points.victory}
              type="number"
              label="points par victore"
            />
          </div>
        )}
      </CardContent>
      {modeAdmin && (
        <CardActions>
          {/* <Button onClick={() => removeGroup(newGroup.id)}>Supprimer</Button> */}
          <Button color="primary" onClick={updateGroup}>
            Sauvegarder
          </Button>
        </CardActions>
      )}
    </Card>
  );
};
