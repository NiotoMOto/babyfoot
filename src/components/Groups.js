import React, { useEffect, useState } from "react";
import { extractData, db } from "../firebaseConfig";
import { useUserContext } from "../App";
import { TextField } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import dayjs from "dayjs";
import { Group } from "./Group";

export const Groups = withRouter(({ history }) => {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState("");
  const [modeAdmin, setModeAdmin] = useState("");
  const currentUser = useUserContext();

  useEffect(() => {
    const unsubscribe = db.collection("groups").onSnapshot(doc => {
      setGroups(extractData(doc));
    });
    return () => unsubscribe();
  }, []);

  const saveGroup = () => {
    db.collection("groups").add({
      name: newGroup,
      points: {
        but: 50,
        butNeg: -10,
        defeat: -75,
        ideal: 10,
        victory: 1000
      }
    });
  };

  return (
    <div>
      {currentUser.admin && (
        <div style={{ padding: "15px" }}>
          <Button onClick={() => setModeAdmin(!modeAdmin)}>Mode admin</Button>
        </div>
      )}
      {modeAdmin && (
        <div style={{ padding: "15px" }}>
          <form
            onSubmit={e => {
              e.preventDefault();
              saveGroup();
            }}>
            <TextField
              value={newGroup}
              onChange={e => setNewGroup(e.target.value)}
            />
            <Button>Add</Button>
          </form>
        </div>
      )}
      {groups.map(group => (
        <Group
          key={group.id}
          group={group}
          history={history}
          modeAdmin={modeAdmin}
        />
      ))}
    </div>
  );
});
