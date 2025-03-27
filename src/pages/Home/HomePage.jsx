import { useState, useEffect } from "react";
import "./HomePage.css";


const HomePage = () => {
  useEffect(() => {
    fetchSystemData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};

export default HomePage;
