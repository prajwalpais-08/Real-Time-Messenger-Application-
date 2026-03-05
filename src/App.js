import React from "react";
import TopBar from "./component/TopBar";
import SideToolbar from "./component/SideToolbar";
import Canvas from "./component/Canvas";
import "./App.css";

function App() {
  return (
    <div className="app">

      <TopBar />

      <div className="workspace">

        <SideToolbar />

        <Canvas />

      </div>

    </div>
  );
}

export default App;