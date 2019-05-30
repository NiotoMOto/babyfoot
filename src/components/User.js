import React, { useState, useEffect } from "react";
import { Chip, Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Badges } from "./Badges";
import { variantStylesLeads } from "../constants";

export function User({ docRef, variant, userObject }) {
  const [user, setUser] = useState(null);
  useEffect(
    () => {
      if (docRef) {
        const promise = docRef
          .get({ source: "cache" })
          .then(doc => setUser(doc.data()));
        return () => promise.then(null);
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
                <span
                  style={{
                    maxWidth: "101px",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                  {user.displayName}
                </span>
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
