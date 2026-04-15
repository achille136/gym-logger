export default function AuthPage({
  authMode,
  setAuthMode,
  email,
  setEmail,
  password,
  setPassword,
  signupName,
  setSignupName,
  signupAge,
  setSignupAge,
  signupHeight,
  setSignupHeight,
  onLogin,
  onSignup,
}) {
  return (
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

      <form onSubmit={authMode === "login" ? onLogin : onSignup} className="form">
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
              Age (optional)
              <input
                value={signupAge}
                onChange={(e) => setSignupAge(e.target.value)}
                type="number"
                min="0"
              />
            </label>
            <label>
              Height (cm, optional)
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
  );
}

