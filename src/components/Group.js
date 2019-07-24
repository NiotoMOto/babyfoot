import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { TextField, Card, CardActions } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { CardContent } from "semantic-ui-react";
import dayjs from "dayjs";

export const Group = ({ group, history, modeAdmin }) => {
  const currentWeek = dayjs().week();
  const currentYear = dayjs().year();
  const [newGroup, setNewgroup] = useState(group);

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
  console.log(newGroup);
  return (
    <Card
      style={{ margin: "10px", padding: "20px" }}
      onClick={() => {
        if (!modeAdmin) {
          history.push(`matchs/${group.id}/${currentYear}/${currentWeek}`);
        }
      }}>
      <CardContent>
        {group.name}
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
          <Button onClick={() => removeGroup(newGroup.id)}>Supprimer</Button>
          <Button color="primary" onClick={updateGroup}>
            Sauvegarder
          </Button>
        </CardActions>
      )}
    </Card>
  );
};
