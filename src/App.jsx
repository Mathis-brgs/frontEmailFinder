import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SirenMode from "./pages/SirenMode";
import FiltresMode from "./pages/FiltresMode";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FiltresMode />} />
        <Route path="/siren" element={<SirenMode />} />
      </Routes>
    </Router>
  );
}

export default App;
