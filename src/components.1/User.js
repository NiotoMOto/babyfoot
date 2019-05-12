import React, { useState, useEffect, Fragment } from "react";
import { Chip, Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Badges } from "./Badges";
import { variantStylesLeads } from "../constants";

export function User({ docRef, variant, userObject }) {
  const [user, setUser] = useState(null);
  useEffect(
    () => {
      if (docRef) {
        docRef.get({ source: "cache" }).then(doc => setUser(doc.data()));
      }
    },
    [docRef]
  );
  useEffect(
    () => {
      setUser(userObject);
    },
    [userObject]
  );
  return (
    <span>
      {user && (
        <Link to={`/profil/${user.uid}`}>
          <Chip
            avatar={<Avatar alt="" src={user.photoURL} />}
            label={
              <div style={{ display: "flex" }}>
                {user.displayName}
                {!variant && <Badges wins={user.wins} />}
              </div>
            }
            style={variantStylesLeads[variant]}
          />
        </Link>
      )}
    </span>
  );
}
