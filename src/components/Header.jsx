import { LogOut } from "react-feather";
import { useAuth } from "../utils/AuthContext";
const Header = () => {
  const { user, handleUserLogout } = useAuth();
  return (
    <div id="header--wrapper">
      {user && (
        <>
          Welcome {user.name}
          <LogOut className="header--link" onClick={handleUserLogout} />
        </>
      )}
    </div>
  );
};
export default Header;
