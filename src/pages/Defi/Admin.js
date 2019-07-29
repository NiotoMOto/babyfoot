import React, { useEffect, useState } from "react";
import { db, extractData } from "../../firebaseConfig";
import dayjs from "dayjs";
import { useUserContext } from "../../App";
import { User } from "../../components/User";
import { Avatar, Card } from "@material-ui/core";
import { useGroupContext } from "../../components/Matchs";

export function DefiAdminPage({ match }) {
  const group = useGroupContext();
  const day = dayjs();
  const [defis, setDefis] = useState([]);
  const currentUser = useUserContext();

  useEffect(() => {
    const unsubscribe = db
      .collection("defis")
      .where("winner", "==", null)
      .where("week", "==", day.week())
      .where("year", "==", day.year())
      .orderBy("createdAt", "desc")
      .onSnapshot(doc => {
        setDefis(extractData(doc));
      });
    return () => unsubscribe();
  }, []);
  return (
    <div style={{ padding: "10px" }}>
      {defis.map(defi => (
        <Card
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
            padding: "10px"
          }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <User currenGroup={group} docRef={defi.requester} />
            <div style={{ textAlign: "center" }}>TO</div>
            <User currenGroup={group} docRef={defi.sendingTo} />
          </div>
          <Avatar style={{ background: "rgb(245, 7, 92)" }}>
            {defi.points}
          </Avatar>
        </Card>
      ))}
    </div>
  );
}
