import React from "react";
import { ProfileLine } from "../../components/ProfileLine";
import { roundRation } from "../../utils";

export function ProfileStats({ currentUser, user, groupId }) {
  const isCurrentUser = currentUser.uid === user.uid;
  return (
    <div style={{ margin: "10px" }}>
      <ProfileLine
        label="buts"
        value={user.stats[groupId].buts}
        valueCurrentUser={currentUser.stats[groupId].buts}
        isCurrentUser={isCurrentUser}
      />
      <ProfileLine
        label="Buts donnés / buts pris"
        value={roundRation(
          user.stats[groupId].buts / user.stats[groupId].butsNeg
        )}
        valueCurrentUser={roundRation(
          currentUser.stats[groupId].buts / currentUser.stats[groupId].butsNeg
        )}
        isCurrentUser={isCurrentUser}
      />
      <ProfileLine
        label="matchs"
        value={user.stats[groupId].parties}
        valueCurrentUser={currentUser.stats[groupId].parties}
        isCurrentUser={isCurrentUser}
      />
      <ProfileLine
        label="victoires"
        value={user.stats[groupId].victories}
        valueCurrentUser={currentUser.stats[groupId].victories}
        isCurrentUser={isCurrentUser}
      />
      <ProfileLine
        label="Taux victoires"
        value={Math.round(
          (user.stats[groupId].victories / user.stats[groupId].parties) * 100
        )}
        valueCurrentUser={Math.round(
          (currentUser.stats[groupId].victories /
            currentUser.stats[groupId].parties) *
            100
        )}
        unit="%"
        isCurrentUser={isCurrentUser}
      />
      <ProfileLine
        label="défaites"
        value={user.stats[groupId].defeats}
        valueCurrentUser={currentUser.stats[groupId].defeats}
        isCurrentUser={isCurrentUser}
        negativeData
      />
    </div>
  );
}
