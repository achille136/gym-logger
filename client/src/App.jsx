import { useEffect, useState } from "react";
import "./App.css";
import { apiGet, apiPost, apiPut } from "./api";

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
        {user ? (
          <div className="topActions">
            <button
              onClick={() => setPage("history")}
              className={page === "history" ? "btn primary" : "btn"}
              type="button"
            >
              History
            </button>
            <button
              onClick={() => setPage("addWeight")}
              className={page === "addWeight" ? "btn primary" : "btn"}
              type="button"
            >
              Add Weight
            </button>
            <button
              onClick={() => setPage("addWorkout")}
              className={page === "addWorkout" ? "btn primary" : "btn"}
              type="button"
            >
              Add Workout
            </button>
            <button
              onClick={() => setPage("profile")}
              className={page === "profile" ? "btn primary" : "btn"}
              type="button"
            >
              Profile
            </button>
            <button onClick={handleLogout} className="btn" type="button">
              Logout
            </button>
          </div>
        ) : null}
      </header>

      {error ? <div className="alert error">{error}</div> : null}
      {message ? <div className="alert ok">{message}</div> : null}

      {!user ? (
        <section className="card">
          <div className="authHeader">
            <h2>{authMode === "login" ? "Login" : "Signup"}</h2>
            <div className="authTabs">
              <button
                className={authMode === "login" ? "btn primary" : "btn"}
                onClick={() => setAuthMode("login")}
                type="button"
              >
                Login
              </button>
              <button
                className={authMode === "signup" ? "btn primary" : "btn"}
                onClick={() => setAuthMode("signup")}
                type="button"
              >
                Signup
              </button>
            </div>
          </div>
          <p className="hint">
            This uses the <code>users</code> table (email + password).
          </p>
          <form
            onSubmit={authMode === "login" ? handleLogin : handleSignup}
            className="form"
          >
            {authMode === "signup" ? (
              <>
                <label>
                  Name
                  <input
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Age
                  <input
                    value={signupAge}
                    onChange={(e) => setSignupAge(e.target.value)}
                    type="number"
                    min="0"
                  />
                </label>
                <label>
                  Height (cm)
                  <input
                    value={signupHeight}
                    onChange={(e) => setSignupHeight(e.target.value)}
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </label>
              </>
            ) : null}
            <label>
              Email
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </label>
            <label>
              Password
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </label>
            <button className="btn primary" type="submit">
              {authMode === "login" ? "Login" : "Create account"}
            </button>
          </form>
        </section>
      ) : (
        <section className="card">
          {page === "history" ? (
            <>
              <h2>History</h2>
              <p className="hint">Your saved weights and workouts (from MySQL).</p>

              <div className="tableWrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="mutedCell">
                          No entries yet. Use “Add Weight” or “Add Workout”.
                        </td>
                      </tr>
                    ) : (
                      history.map((row) => (
                        <tr key={`${row.type}-${row.id}`}>
                          <td>{String(row.log_date).slice(0, 10)}</td>
                          <td>{row.type}</td>
                          <td>
                            {row.type === "weight" ? (
                              <span>
                                Weight: <b>{row.weight}</b> kg
                              </span>
                            ) : (
                              <span>
                                <b>{row.exercise_name}</b>
                                {row.sets != null ? ` • ${row.sets} sets` : ""}
                                {row.reps != null ? ` • ${row.reps} reps` : ""}
                                {row.duration != null ? ` • ${row.duration} min` : ""}
                                {row.notes ? ` • ${row.notes}` : ""}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : null}

          {page === "addWeight" ? (
            <>
              <h2>Add Daily Weight</h2>
              <form onSubmit={handleAddWeight} className="form">
                <label>
                  Date
                  <input
                    value={weightDate}
                    onChange={(e) => setWeightDate(e.target.value)}
                    type="date"
                    required
                  />
                </label>
                <label>
                  Weight (kg)
                  <input
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    type="number"
                    step="0.01"
                    min="0"
                    required
                  />
                </label>
                <button className="btn primary" type="submit">
                  Save Weight
                </button>
              </form>
            </>
          ) : null}

          {page === "addWorkout" ? (
            <>
              <h2>Add Workout</h2>
              <form onSubmit={handleAddWorkout} className="form">
                <label>
                  Date
                  <input
                    value={workoutDate}
                    onChange={(e) => setWorkoutDate(e.target.value)}
                    type="date"
                    required
                  />
                </label>
                <label>
                  Exercise
                  <select
                    className="select"
                    value={exerciseId}
                    onChange={(e) => setExerciseId(e.target.value)}
                    required
                  >
                    <option value="">Select exercise</option>
                    {exercises.map((ex) => (
                      <option key={ex.exercise_id} value={ex.exercise_id}>
                        {ex.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Sets (optional)
                  <input
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                    type="number"
                    min="0"
                  />
                </label>
                <label>
                  Reps (optional)
                  <input
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    type="number"
                    min="0"
                  />
                </label>
                <label>
                  Duration (minutes, optional)
                  <input
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    type="number"
                    min="0"
                  />
                </label>
                <label>
                  Notes (optional)
                  <input value={notes} onChange={(e) => setNotes(e.target.value)} />
                </label>
                <button className="btn primary" type="submit">
                  Save Workout
                </button>
              </form>
            </>
          ) : null}

          {page === "profile" ? (
            <>
              <h2>Edit Profile</h2>
              <p className="hint">
                Saving updates <b>MySQL</b> and also updates your <b>active session</b>.
              </p>

              <form onSubmit={handleSaveProfile} className="form">
                <label>
                  Name
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Email
                  <input
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    type="email"
                    required
                  />
                </label>
                <label>
                  Age
                  <input
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    type="number"
                    min="0"
                  />
                </label>
                <label>
                  Height (cm)
                  <input
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </label>

                <button className="btn primary" type="submit">
                  Save
                </button>
              </form>

              <div className="small">
                <b>Session user now:</b>
                <pre>{JSON.stringify(user, null, 2)}</pre>
              </div>
            </>
          ) : null}
        </section>
      )}
    </div>
  );
}

export default App;
