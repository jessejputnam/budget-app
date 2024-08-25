import { useState } from "react";
// import "./App.css";
import HomeScreen from "./Screens/HomeScreen";
import EditEnvelopesScreen from "./Screens/EditEvelopesScreen";
// import ErrorScreen from "./Screens/ErrorScreen";

function App() {
  const [screen, setScreen] = useState(<HomeScreen />);

  const handleNavClick = (newScreen: JSX.Element) => setScreen(newScreen);


  const cssBtn = "bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow";
  const cssHeader = "flex items-center justify-center p-4 shadow gap-10";

  return (
    <>
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className={cssHeader}>
          <button className={cssBtn} onClick={() => handleNavClick(<HomeScreen />)}>Home</button>
          <button className={cssBtn} onClick={() => handleNavClick(<EditEnvelopesScreen />)}>Edit Envelopes</button>
        </div>
        {screen}
      </div>
    </>
  );
}

export default App;
