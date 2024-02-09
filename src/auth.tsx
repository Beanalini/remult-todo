import { FormEvent, useEffect, useState } from "react";
import { remult } from "remult";
import App from "./App";

export default function Auth() {
  const [username, setUserName] = useState("");
  const [signedIn, setSignedIn] = useState(false);

  async function signIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await fetch("/api/signIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
    if (result.ok) {
      remult.user = await result.json();
      setSignedIn(true);
      setUserName("");
    } else {
      alert(await result.json());
    }
  }

  useEffect(() => {
    async function getCurrentUser() {
      const result = await fetch("api/currentUser");
      remult.user = await result.json();
      if (remult.user) setSignedIn(true);
    }
    getCurrentUser();
  }, []);

  if (!signedIn)
    return (
      <>
        <h1>Todos</h1>
        <main>
          <form onSubmit={(e) => signIn(e)}>
            <input
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="username. try Steve or Jane"
            />
            <button>Sign In</button>
          </form>
        </main>
      </>
    );

  async function signOut() {
    await fetch("/api/signOut", {
      method: "POST",
    });
    remult.user = undefined;
    setSignedIn(false);
  }

  return (
    <>
      <header>
        Hello {remult.user!.name}{" "}
        <button onClick={() => signOut()}>Sign Out</button>
      </header>
      <App />
    </>
  );
}
