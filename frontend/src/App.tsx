import { useState } from "react";
import "./App.css";
import HomeScreen from "./Screens/HomeScreen";
import EditEnvelopesScreen from "./Screens/EditEvelopesScreen";
// import ErrorScreen from "./Screens/ErrorScreen";

function App() {
  const [screen, setScreen] = useState(<HomeScreen />);

  const handleNavClick = (newScreen: JSX.Element) => setScreen(newScreen);


  //screen === "home" ? <HomeScreen /> : screen === "editEnvelopes" ? <EditEnvelopesScreen /> : null;

  return (
    <>
      <div>
        <ul>
          <li>
            <button onClick={() => handleNavClick(<HomeScreen />)}>Home</button>
            <button onClick={() => handleNavClick(<EditEnvelopesScreen />)}>Edit Envelopes</button>
          </li>
        </ul>
      </div>
      {screen}
    </>
  );
}

export default App;
