import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

const Layout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access_token"));

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("access_token"));
    };

    // Listen for custom event
    window.addEventListener("authChanged", handleAuthChange);

    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
    };
  }, []);

  return (
    <>
      {isLoggedIn && <Navbar />}
      <Outlet />
    </>
  );
};

export default Layout;
