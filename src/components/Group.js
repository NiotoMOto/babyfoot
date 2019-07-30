import React, { useState, useEffect, Fragment } from "react";
import { db } from "../firebaseConfig";
import {
  TextField,
  Card,
  CardActions,
  Typography,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from "@material-ui/core";
import { Button } from "@material-ui/core";
import { orderBy } from "lodash";
import { CardContent, CardHeader, Divider } from "semantic-ui-react";
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
  return (
    <Card style={{ margin: "10px", padding: "20px" }}>
      {/* <CardMedia
        image="/static/images/cards/contemplative-reptile.jpg"
        title="Contemplative Reptile"
      /> */}
      <CardHeader>
        <Typography
          style={{ textAlign: "center", color: "#0d47a1" }}
          variant="h4">
          {group.name}
        </Typography>
      </CardHeader>
      <CardContent>
        <List>
          <ListItem style={{ textAlign: "center", color: "#C98910" }}>
            <ListItemAvatar>
              {king && (
                <User
                  disableLink
                  variant="or"
                  docRef={king.docRef}
                  currenGroup={group.id}
                />
              )}
            </ListItemAvatar>
            <ListItemText style={{ textAlign: "right" }} primary="King" />
          </ListItem>
          <ListItem style={{ textAlign: "center", color: "#f44336" }}>
            {group && (
              <ListItemAvatar>
                <User
                  disableLink
                  variant="prince"
                  docRef={group.prince}
                  currenGroup={group.id}
                />
              </ListItemAvatar>
            )}
            <ListItemText style={{ textAlign: "right" }} primary="Prince" />
          </ListItem>
        </List>
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
      <CardActions style={{ textAlign: "right" }}>
        <Divider />
        <Button
          onClick={() => {
            history.push(`matchs/${group.id}/${currentYear}/${currentWeek}`);
          }}
          color="primary"
          size="large">
          Y aller
        </Button>
        {modeAdmin && (
          <Fragment>
            {/* <Button onClick={() => removeGroup(newGroup.id)}>Supprimer</Button> */}
            <Button color="primary" onClick={updateGroup}>
              Sauvegarder
            </Button>
          </Fragment>
        )}
      </CardActions>
    </Card>
  );
};
