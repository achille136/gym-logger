export default function HistoryPage({ history }) {
  return (
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
  );
}

