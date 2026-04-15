export default function ProfilePage({
  name,
  setName,
  profileEmail,
  setProfileEmail,
  age,
  setAge,
  height,
  setHeight,
  onSave,
  user,
}) {
  return (
    <>
      <h2>Edit Profile</h2>
      <p className="hint">
        Saving updates <b>MySQL</b> and also updates your <b>active session</b>.
      </p>

      <form onSubmit={onSave} className="form">
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
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
          <input value={age} onChange={(e) => setAge(e.target.value)} type="number" min="0" />
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
  );
}

