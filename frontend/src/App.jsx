import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/layout";
import HomePage from "./pages/Home-page";
import LoginPage from "./pages/Login-page";
import RegisterPage from "./pages/Register-page";
import AddVideoPage from "./pages/add-video-page";
import VideoPlayer from "./pages/video-page";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/add-video" element={<AddVideoPage />} />
          </Route>
          <Route path="/video/:slug" element={<VideoPlayer />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
