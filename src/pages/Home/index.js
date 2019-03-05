import React, { useState, useEffect } from "react";
import { AddMatchButton } from "../../components/AddMatchButton";
import { AddMatchdialog } from "../../components/AddMatchDialog";
import { db, extractData } from "../../firebaseConfig";
import { Match } from "../../components/Match";

export function Home() {
  const [openAddMatch, setOpenAddMatch] = useState(false);
  const [matchs, setMatchs] = useState([]);
  useEffect(() => {
    const unsubscribe = db
      .collection("matchs")
      .limit(50)
      .onSnapshot(doc => {
        setMatchs(extractData(doc));
      });

    return () => unsubscribe();
  }, []);
  return (
    <div style={{ marginBottom: "90px" }}>
      <AddMatchButton onClick={() => setOpenAddMatch(true)} />
      <AddMatchdialog
        open={openAddMatch}
        handleClose={() => setOpenAddMatch(false)}
      />
      {matchs.map((match, id) => (
        <Match key={id} match={match} />
      ))}
    </div>
  );
}
