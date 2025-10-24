

import Login from "./pages/Login";

function App() {
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;



/*
import React, { useEffect, useState } from "react";

const App: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  useEffect((): void => {
    fetch("/api/hello")
      .then((res: Response): Promise<{ message: string; status: boolean }> => res.json())
      .then((data: { message: string; status: boolean }): void => setMessage(data.message))
      .catch((err: Error): void => console.error(err));
  }, []);

  return (
    <div style={{
      width: "100%",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <div style={{
        textAlign: "center"
      }}>
        <h1>HOLAAAAAA, zxczxc</h1>
        <p>{message || "Cargando..."}</p>
      </div>
    </div>
  );
}

export default App;
 */