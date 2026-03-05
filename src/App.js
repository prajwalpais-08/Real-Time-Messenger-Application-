import React from "react";
import "./App.css";

import TopBar from "./component/TopBar";
import SideToolbar from "./component/SideToolbar";
import Canvas from "./component/Canvas";

function App() {
  return (
    <div className="workspace">

      <TopBar />

      <div className="main-area">
        <SideToolbar />
        <Canvas />
      </div>

    </div>
  );
}

export default App;
