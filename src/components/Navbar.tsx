import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <nav className="bg-orange-500 text-white shadow-lg">

      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          <img src="/images/logo.png" alt="Logo" />
          Pedidos Lanche
        </Link>

        {isAdminPage && (
          <button className="px-4 py-2 bg-white text-orange-500 rounded-lg font-semibold hover:bg-gray-100 transition cursor-pointer"
            onClick={handleLogout}
          >
            Log Out
          </button>
        )}

      </div>
    </nav>
  );
};

export default Navbar;