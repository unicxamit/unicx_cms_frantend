import { NavLink, useNavigate } from "react-router-dom";
import JobZImage from "../../../../common/jobz-img";
import { canRoute, candidate, empRoute, employer, publicUser } from "../../../../../globals/route-names";
import { useState } from "react";
import processLogin from "../../../../form-processing/login";
import { formType } from "../../../../../globals/constants";
import "./login.css";

function LoginPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("candidate");
  const [canusername, setCanUsername] = useState("guest");
  const [empusername, setEmpUsername] = useState("admin");
  const [canPassword, setCanPassword] = useState("12345");
  const [empPassword, setEmpPassword] = useState("12345");
  const [loginError, setLoginError] = useState("");

  const moveToCandidate = () => {
    navigate(canRoute(candidate.DASHBOARD));
  };

  const moveToEmployer = () => {
    navigate(empRoute(employer.DASHBOARD));
  };

  const handleCandidateLogin = (event) => {
    event.preventDefault();
    setLoginError("");
    processLogin(
      {
        type: formType.LOGIN_CANDIDATE,
        username: canusername,
        password: canPassword,
      },
      (valid) => {
        if (valid) {
          moveToCandidate();
          return;
        }
        setLoginError("Invalid candidate credentials.");
      },
    );
  };

  const handleEmployerLogin = (event) => {
    event.preventDefault();
    setLoginError("");
    processLogin(
      {
        type: formType.LOGIN_EMPLOYER,
        username: empusername,
        password: empPassword,
      },
      (valid) => {
        if (valid) {
          moveToEmployer();
          return;
        }
        setLoginError("Invalid employer credentials.");
      },
    );
  };

  return (
    <div className="unicx-login-page">
      <div className="unicx-login-shell">
        <aside className="unicx-login-visual">
          <div className="unicx-login-visual-overlay">
            <h1>Welcome Back</h1>
            <p>Sign in to manage your profile, listings, and dashboard from one place.</p>
            <ul>
              <li>Fast access to your dashboard</li>
              <li>Secure and role-based login</li>
              <li>Clean workflow for candidates and employers</li>
            </ul>
          </div>
          <JobZImage src="images/login-bg.png" alt="Login visual" />
        </aside>

        <section className="unicx-login-panel">
          <div className="unicx-login-logo">
            <NavLink to={publicUser.HOME1}>
              <JobZImage src="images/logo-dark.png" alt="UNICX logo" className="logo" />
            </NavLink>
          </div>

          <h2 className="unicx-login-title">Login</h2>
          <p className="unicx-login-subtitle">Choose your role and continue.</p>

          <div className="unicx-login-tabs" role="tablist" aria-label="Login roles">
            <button
              type="button"
              className={activeTab === "candidate" ? "active" : ""}
              onClick={() => {
                setActiveTab("candidate");
                setLoginError("");
              }}
            >
              Candidate
            </button>
            <button
              type="button"
              className={activeTab === "employer" ? "active" : ""}
              onClick={() => {
                setActiveTab("employer");
                setLoginError("");
              }}
            >
              Employer
            </button>
          </div>

          {loginError ? <div className="unicx-login-error">{loginError}</div> : null}

          {activeTab === "candidate" ? (
            <form onSubmit={handleCandidateLogin} className="unicx-login-form">
              <label htmlFor="candidate-username">Username</label>
              <input
                id="candidate-username"
                name="username"
                type="text"
                required
                placeholder="Enter candidate username"
                value={canusername}
                onChange={(event) => setCanUsername(event.target.value)}
              />

              <label htmlFor="candidate-password">Password</label>
              <input
                id="candidate-password"
                name="password"
                type="password"
                required
                placeholder="Enter password"
                value={canPassword}
                onChange={(event) => setCanPassword(event.target.value)}
              />

              <button type="submit" className="unicx-login-submit">
                Login as Candidate
              </button>
            </form>
          ) : (
            <form onSubmit={handleEmployerLogin} className="unicx-login-form">
              <label htmlFor="employer-username">Username</label>
              <input
                id="employer-username"
                name="username"
                type="text"
                required
                placeholder="Enter employer username"
                value={empusername}
                onChange={(event) => setEmpUsername(event.target.value)}
              />

              <label htmlFor="employer-password">Password</label>
              <input
                id="employer-password"
                name="password"
                type="password"
                required
                placeholder="Enter password"
                value={empPassword}
                onChange={(event) => setEmpPassword(event.target.value)}
              />

              <button type="submit" className="unicx-login-submit">
                Login as Employer
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

export default LoginPage;
