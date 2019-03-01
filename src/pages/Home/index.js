import React, { useState } from "react";
import { AddMatchButton } from "../../components/AddMatchButton";
import { AddMatchdialog } from "../../components/AddMatchDialog";

export function Home() {
  const [openAddMatch, setOpenAddMatch] = useState(false);
  return (
    <div>
      <AddMatchButton onClick={() => setOpenAddMatch(true)} />
      <AddMatchdialog
        open={openAddMatch}
        handleClose={() => setOpenAddMatch(false)}
      />
    </div>
  );
}
