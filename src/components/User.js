import React, { useState, useEffect } from "react";
import { Chip, Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Badges } from "./Badges";
import { get } from "lodash";
import { variantStylesLeads } from "../constants";
import { db } from "../firebaseConfig";

export function User({
  docRef,
  variant,
  userObject,
  currenGroup,
  disableLink
}) {
  const [user, setUser] = useState(null);
  useEffect(
    () => {
      if (docRef) {
        const promise = docRef.get().then(doc => setUser(doc.data()));
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
  const wins = currenGroup ? get(user, `wins.${currenGroup}`, {}) : {};
  return (
    <span>
      {user && (
        <Link
          to={`/profil/${user.uid}`}
          onClick={e => {
            if (disableLink) {
              e.preventDefault();
            }
          }}>
          <Chip
            avatar={<Avatar alt="" src={user.photoURL} />}
            label={
              <div style={{ display: "flex" }}>
                <span
                  style={{
                    maxWidth: "100px",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                  {user.displayName}
                </span>
                {!variant && <Badges wins={wins || {}} />}
              </div>
            }
            style={variantStylesLeads[variant]}
          />
        </Link>
      )}
    </span>
  );
}
