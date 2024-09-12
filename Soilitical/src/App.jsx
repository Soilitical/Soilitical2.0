import { BrowserRouter, Routes, Route } from "react-router-dom";
import BaseLayout from "./BaseLayout";
import Home from "./Home";
import Login from "./Login"; // Import the Login component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Login />} />
          {/* Add more routes for other pages like About, Contact, etc. */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
