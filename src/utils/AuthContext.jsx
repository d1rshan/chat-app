import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../appwrite/appwriteConfig";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const handleUserRegister = async (e, credentials) => {
    e.preventDefault();

    if (credentials.password1 !== credentials.password2) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const res = await account.create(
        ID.unique(),
        credentials.email,
        credentials.password1,
        credentials.name
      );

      await account.createEmailPasswordSession(
        credentials.email,
        credentials.password1
      );
      const userDetails = await account.get();
      setUser(userDetails);
      navigate("/");
      console.log("REGISTERED:", res);
    } catch (error) {
      console.error(error);
    }
  };
  const handleUserLogin = async (e, credentials) => {
    e.preventDefault();
    try {
      const res = await account.createEmailPasswordSession(
        credentials.email,
        credentials.password
      );
      console.log("LOGGED IN", res);
      const userDetails = await account.get();
      setUser(userDetails);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserLogout = async () => {
    await account.deleteSession("current");
    setUser(null);
  };
  const contextData = {
    user,
    handleUserLogin,
    handleUserLogout,
    handleUserRegister,
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const userDetails = await account.get();
      setUser(userDetails);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
export default AuthContext;
