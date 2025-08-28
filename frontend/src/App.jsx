import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/layout";
import AppProvider from "./context/app-context";
import HomePage from "./pages/Home-page";
import LoginPage from "./pages/Login-page";
import RegisterPage from "./pages/Register-page";
import AddVideoPage from "./pages/add-video-page";
import VideoPlayer from "./pages/video-page";
import ManageVideosPage from "./pages/ManageVideos-page";

function App() {
  return (
    <>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/add-video" element={<AddVideoPage />} />
              <Route path="/manage-videos" element={<ManageVideosPage />} />
            </Route>
            <Route path="/video/:videoId" element={<VideoPlayer />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </>
  );
}

export default App;
