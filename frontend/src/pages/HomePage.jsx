import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';

function HomePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Home</h1>
      <p className="mt-2">Welcome, {user?.name}</p>

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-600 text-white rounded px-4 py-2"
      >
        Logout
      </button>
    </div>
  );
}

export default HomePage;