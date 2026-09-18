import { useState, useEffect } from 'react';
import Cookies from "js-cookie";

const useAdminInfo = () => {
  const [adminInfo, setAdminInfo] = useState(null);

  useEffect(() => {
    const storedAdminInfo = Cookies.get("adminInfo");

    if (storedAdminInfo) {
      try {
        setAdminInfo(JSON.parse(storedAdminInfo));
      } catch (error) {
        console.error("Failed to parse adminInfo from localStorage:", error);
        setAdminInfo(null);
      }
    }
  }, []); // Empty dependency array means this runs once on mount

  return adminInfo;
};

export default useAdminInfo;
