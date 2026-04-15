import { useEffect, useState } from "react";
import "./App.css";
import { apiGet, apiPost, apiPut } from "./api";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import HistoryPage from "./pages/HistoryPage";
import AddWeightPage from "./pages/AddWeightPage";
import AddWorkoutPage from "./pages/AddWorkoutPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [authMode, setAuthMode] = useState("login"); // "login" | "signup"
  const [page, setPage] = useState("history"); // "history" | "addWeight" | "addWorkout" | "profile"

  // login / signup form
  const [signupName, setSignupName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupAge, setSignupAge] = useState("");
  const [signupHeight, setSignupHeight] = useState("");

  // logs
  const [history, setHistory] = useState([]);
  const [exercises, setExercises] = useState([]);

  // add weight
  const [weight, setWeight] = useState("");
  const [weightDate, setWeightDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );

  // add workout
  const [workoutDate, setWorkoutDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [exerciseId, setExerciseId] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");

  // profile form
  const [name, setName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");

  async function loadMe() {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet("/me");
      setUser(data.user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMe();
  }, []);

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setProfileEmail(user.email || "");
    setAge(user.age ?? "");
    setHeight(user.height ?? "");
  }, [user]);

  async function loadHistory() {
    setError("");
    try {
      const data = await apiGet("/history");
      setHistory(data.history || []);
    } catch (e) {
      setError(e.message);
    }
  }

  async function loadExercises() {
    setError("");
    try {
      const data = await apiGet("/exercises");
      setExercises(data.exercises || []);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    if (!user) return;
    loadHistory();
    loadExercises();
  }, [user]);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const data = await apiPost("/login", { email, password });
      setUser(data.user);
      setPage("history");
      setPassword("");
      setMessage("Logged in!");
    } catch (e2) {
      setError(e2.message);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    const payload = {
      name: signupName,
      email,
      password,
      age: signupAge === "" ? null : Number(signupAge),
      height: signupHeight === "" ? null : Number(signupHeight),
    };

    try {
      const data = await apiPost("/signup", payload);
      setUser(data.user); // auto-login after signup
      setPage("history");
      setPassword("");
      setMessage("Account created!");
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleLogout() {
    setError("");
    setMessage("");
    try {
      await apiPost("/logout", {});
      setUser(null);
      setAuthMode("login");
      setPage("history");
      setSignupName("");
      setEmail("");
      setPassword("");
      setSignupAge("");
      setSignupHeight("");
      setMessage("Logged out.");
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleAddWeight(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await apiPost("/weight-logs", { weight: Number(weight), log_date: weightDate });
      setWeight("");
      setMessage("Weight saved!");
      setPage("history");
      loadHistory();
    } catch (e2) {
      setError(e2.message);
    }
  }

  async function handleAddWorkout(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await apiPost("/workout-logs", {
        exercise_id: Number(exerciseId),
        sets: sets === "" ? null : Number(sets),
        reps: reps === "" ? null : Number(reps),
        duration: duration === "" ? null : Number(duration),
        log_date: workoutDate,
        notes: notes || null,
      });
      setExerciseId("");
      setSets("");
      setReps("");
      setDuration("");
      setNotes("");
      setMessage("Workout saved!");
      setPage("history");
      loadHistory();
    } catch (e2) {
      setError(e2.message);
    }
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    const payload = {
      name,
      email: profileEmail,
      age: age === "" ? null : Number(age),
      height: height === "" ? null : Number(height),
    };

    try {
      const data = await apiPut("/profile", payload);
      setUser(data.user); // session is updated by server, we keep UI in sync
      setMessage("Profile updated!");
    } catch (e) {
      setError(e.message);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <h1>Gym Logger</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="header">
        <h1>Gym Membership & Workout Logger</h1>
        {user ? <Navbar page={page} setPage={setPage} onLogout={handleLogout} /> : null}
      </header>

      {error ? <div className="alert error">{error}</div> : null}
      {message ? <div className="alert ok">{message}</div> : null}

      {!user ? (
        <AuthPage
          authMode={authMode}
          setAuthMode={setAuthMode}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          signupName={signupName}
          setSignupName={setSignupName}
          signupAge={signupAge}
          setSignupAge={setSignupAge}
          signupHeight={signupHeight}
          setSignupHeight={setSignupHeight}
          onLogin={handleLogin}
          onSignup={handleSignup}
        />
      ) : (
        <section className="card">
          {page === "history" ? <HistoryPage history={history} /> : null}

          {page === "addWeight" ? (
            <AddWeightPage
              weightDate={weightDate}
              setWeightDate={setWeightDate}
              weight={weight}
              setWeight={setWeight}
              onSave={handleAddWeight}
            />
          ) : null}

          {page === "addWorkout" ? (
            <AddWorkoutPage
              workoutDate={workoutDate}
              setWorkoutDate={setWorkoutDate}
              exercises={exercises}
              exerciseId={exerciseId}
              setExerciseId={setExerciseId}
              sets={sets}
              setSets={setSets}
              reps={reps}
              setReps={setReps}
              duration={duration}
              setDuration={setDuration}
              notes={notes}
              setNotes={setNotes}
              onSave={handleAddWorkout}
            />
          ) : null}

          {page === "profile" ? (
            <ProfilePage
              name={name}
              setName={setName}
              profileEmail={profileEmail}
              setProfileEmail={setProfileEmail}
              age={age}
              setAge={setAge}
              height={height}
              setHeight={setHeight}
              onSave={handleSaveProfile}
              user={user}
            />
          ) : null}
        </section>
      )}
    </div>
  );
}

export default App;
