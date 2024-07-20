import React, { useState } from 'react';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async () => {
    // Perform login via API
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'user', password: 'password' })
    });

    if (response.ok) {
      setLoggedIn(true);
    }
  };

  const handleLogout = async () => {
    // Perform logout via API
    const response = await fetch('http://localhost:3000/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      setLoggedIn(false);
    }
  };

  return (
    <div>
      {!loggedIn ? (
        <button onClick={handleLogin}>Login</button>
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}
    </div>
  );
}

export default App;
