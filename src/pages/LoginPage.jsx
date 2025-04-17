import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { Link } from "react-feather";
const LoginPage = () => {
  const { user, handleUserLogin } = useAuth();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  // redirect if user is logged in already
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  });
  return (
    <div className="auth--container">
      <div className="form--wrapper">
        <form onSubmit={(e) => handleUserLogin(e, credentials)}>
          <div className="field--wrapper">
            <label>Email:</label>
            <input
              type="email"
              required
              placeholder="Enter your email..."
              value={credentials.email}
              onChange={(e) => {
                setCredentials({ ...credentials, email: e.target.value });
              }}
            />
          </div>
          <div className="field--wrapper">
            <label>Password:</label>
            <input
              type="password"
              required
              placeholder="Enter password..."
              value={credentials.password}
              onChange={(e) => {
                setCredentials({ ...credentials, password: e.target.value });
              }}
            />
          </div>

          <div className="field--wrapper">
            <input className="btn btn--lg btn--main" type="submit" />
          </div>
        </form>
        <p>
          Don't have an account? Register <a href={"/register"}>here</a>
        </p>
      </div>
    </div>
  );
};
export default LoginPage;
