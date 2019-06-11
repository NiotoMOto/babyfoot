import React, { useEffect } from "react";
import { db, extractData } from "../firebaseConfig";

export function Tournois() {
  const [tournois, setTournois] = useEffect(null);
  useEffect(() => {
    db.collection("tournois")
      .where("open", "==", true)
      .onSnapshot(doc => {
        setTournois(extractData(doc));
      });
  }, []);
  return (
    <div>
      {tournois && (
        <div>
          {tournois.map(tournoi => (
            <div>
              <div>{tournoi.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
