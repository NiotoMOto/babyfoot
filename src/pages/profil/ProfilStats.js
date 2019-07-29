import React from "react";
import { ProfileLine } from "../../components/ProfileLine";
import { roundRation } from "../../utils";

const defualtStats = {
  buts: 0,
  butsNeg: 0,
  defeats: 0,
  parties: 0,
  victories: 0
};

export function ProfileStats({ currentUser, user, groupId }) {
  const isCurrentUser = currentUser.uid === user.uid;
  const statsUser = user.stats[groupId] || defualtStats;
  const statsCurrentUser = currentUser.stats[groupId] || defualtStats;
  return (
    <div style={{ margin: "10px" }}>
      <ProfileLine
        label="buts"
        value={statsUser.buts}
        valueCurrentUser={statsCurrentUser.buts}
        isCurrentUser={isCurrentUser}
      />
      <ProfileLine
        label="Buts donnés / buts pris"
        value={roundRation(statsUser.buts / statsUser.butsNeg)}
        valueCurrentUser={roundRation(
          statsCurrentUser.buts / statsCurrentUser.butsNeg
        )}
        isCurrentUser={isCurrentUser}
      />
      <ProfileLine
        label="matchs"
        value={statsUser.parties}
        valueCurrentUser={statsCurrentUser.parties}
        isCurrentUser={isCurrentUser}
      />
      <ProfileLine
        label="victoires"
        value={statsUser.victories}
        valueCurrentUser={statsCurrentUser.victories}
        isCurrentUser={isCurrentUser}
      />
      <ProfileLine
        label="Taux victoires"
        value={Math.round((statsUser.victories / statsUser.parties) * 100)}
        valueCurrentUser={Math.round(
          (statsCurrentUser.victories / statsCurrentUser.parties) * 100
        )}
        unit="%"
        isCurrentUser={isCurrentUser}
      />
      <ProfileLine
        label="défaites"
        value={statsUser.defeats}
        valueCurrentUser={statsCurrentUser.defeats}
        isCurrentUser={isCurrentUser}
        negativeData
      />
    </div>
  );
}
