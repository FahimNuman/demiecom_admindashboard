import { FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center py-2 px-4 bg-cyan-900 max-w-[1840px] border rounded-lg">
      <div className="text-white text-lg font-bold">Demi Ui Admin Panel</div>
      <div className="text-white text-2xl flex items-center">
        <div className="text-white text-lg font-bold mr-4">Super Admin</div>
        <button
          className="bg-transparent border-none cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <FaUserShield className="text-white text-2xl" />
        </button>
      </div>
    </header>
  );
};

export default Header;