import React, { useState, useEffect } from "react";
import { Chip, Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";

export function User({ docRef }) {
  const [user, setUser] = useState(null);
  useEffect(
    () => {
      docRef.get({ source: "cache" }).then(doc => setUser(doc.data()));
    },
    [docRef]
  );
  return (
    <span>
      {user && (
        <Link to={`/profil/${user.uid}`}>
          <Chip
            avatar={<Avatar alt="" src={user.photoURL} />}
            label={user.displayName}
          />
        </Link>
      )}
    </span>
  );
}
