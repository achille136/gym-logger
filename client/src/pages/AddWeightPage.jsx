export default function AddWeightPage({
  weightDate,
  setWeightDate,
  weight,
  setWeight,
  onSave,
}) {
  return (
    <>
      <h2>Add Daily Weight</h2>
      <form onSubmit={onSave} className="form">
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
  );
}

