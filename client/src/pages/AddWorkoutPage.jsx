export default function AddWorkoutPage({
  workoutDate,
  setWorkoutDate,
  exercises,
  exerciseId,
  setExerciseId,
  sets,
  setSets,
  reps,
  setReps,
  duration,
  setDuration,
  notes,
  setNotes,
  onSave,
}) {
  return (
    <>
      <h2>Add Workout</h2>
      <form onSubmit={onSave} className="form">
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
          <input value={sets} onChange={(e) => setSets(e.target.value)} type="number" min="0" />
        </label>
        <label>
          Reps (optional)
          <input value={reps} onChange={(e) => setReps(e.target.value)} type="number" min="0" />
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
  );
}

