import { useState, useEffect } from "react";
import "./HomePage.css";
import "../../App.css";


const HomePage = () => {
  return (
    <div>
      <h1 className="page-title">Accounts</h1>
      <div>
        <div className="card">
          <h2>Account 1</h2>
          <p>Account details go here...</p>
        </div>
        <div className="card">
          <h2>Account 2</h2>
          <p>Account details go here...</p>
        </div>
        <div className="card">
          <h2>Account 3</h2>
          <p>Account details go here...</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
