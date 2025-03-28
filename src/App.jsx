import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InterfaceOutput from "./Global/Bars/InterfaceOuput/InterfaceOuput";
import HomePage from "./pages/Home/HomePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InterfaceOutput />}>
          <Route index element={<HomePage />} />
          <Route path="home" element={<HomePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;