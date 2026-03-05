import React from "react";
import "./TopBar.css";

function TopBar() {
  return (
    <div className="topbar">

      <div className="logo">
        tutorials<span>point</span>
      </div>

      <div className="board-controls">
        <button>⏮</button>
        <button>◀</button>

        <span>Board</span>

        <input type="number" value="1" readOnly />

        <span>of 1</span>

        <button>▶</button>
        <button>⏭</button>
      </div>

    </div>
  );
}

export default TopBar;