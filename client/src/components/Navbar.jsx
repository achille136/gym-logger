export default function Navbar({ page, setPage, onLogout }) {
  return (
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
      <button onClick={onLogout} className="btn" type="button">
        Logout
      </button>
    </div>
  );
}

