import React from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";

function App() {
  console.log("REACT_APP_API_URL", process.env.REACT_APP_API_URL);
  console.log("API_URL", process.env.API_URL);
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
