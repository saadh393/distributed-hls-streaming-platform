import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/layout";
import HomePage from "./pages/Home-page";
import LoginPage from "./pages/Login-page";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
