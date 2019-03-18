import React from "react";
import { ProfileLine } from "../../components/ProfileLine";
import { roundRation } from "../../utils";

export function ProfileStats({ currentUser, user }) {
  const isCurrentUser = currentUser.uid === user.uid;
  return (
    <div style={{ margin: "10px" }}>
      <ProfileLine
        label="buts"
        value={user.stats.buts}
        valueCurrentUser={currentUser.stats.buts}
        isCurrentUser={isCurrentUser}
      />
      <ProfileLine
        label="Buts donnés / buts pris"
        value={roundRation(user.stats.buts / user.stats.butsNeg)}
        valueCurrentUser={roundRation(
          currentUser.stats.buts / currentUser.stats.butsNeg
        )}
        isCurrentUser={isCurrentUser}
      />
      <ProfileLine
        label="matchs"
        value={user.stats.parties}
        valueCurrentUser={currentUser.stats.parties}
        isCurrentUser={isCurrentUser}
      />
      <ProfileLine
        label="victoires"
        value={user.stats.victories}
        valueCurrentUser={currentUser.stats.victories}
        isCurrentUser={isCurrentUser}
      />
      <ProfileLine
        label="Taux victoires"
        value={Math.round((user.stats.victories / user.stats.parties) * 100)}
        valueCurrentUser={Math.round(
          (currentUser.stats.victories / currentUser.stats.parties) * 100
        )}
        unit="%"
        isCurrentUser={isCurrentUser}
      />
      <ProfileLine
        label="défaites"
        value={user.stats.defeats}
        valueCurrentUser={currentUser.stats.defeats}
        isCurrentUser={isCurrentUser}
        negativeData
      />
    </div>
  );
}
