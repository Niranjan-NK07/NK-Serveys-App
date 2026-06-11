import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import RegisterOrLogin from "./pages/RegisterOrLogin.tsx";
import Home from "./pages/Home";
import Navbar from "./components/Navbar.tsx";
import CreatePoll from "./pages/CreatePoll.tsx";
import VotingScreen from "./pages/VotingScreen.tsx";
import DrawerComponent from "./components/DrawerComponent.tsx";
import MyPolls from "./pages/MyPolls.tsx";

function AppContent() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/" && location.pathname !== "/login" && (
        <>
          <Navbar />
          <DrawerComponent />
        </>
      )}
      <Routes>
        <Route path="/" Component={RegisterOrLogin} />
        <Route path="/Home" Component={Home} />
        <Route path="/create-poll" Component={CreatePoll} />
        <Route path="/voting" Component={VotingScreen} />
        <Route path="/my-polls" Component={MyPolls} />
      </Routes>
    </>
  );
}

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
