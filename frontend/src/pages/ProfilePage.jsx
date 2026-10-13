import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProfile } from '../features/auth/authSlice';

function ProfilePage() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const handleDeactivate = () => {
    if (window.confirm('Deactivate your account? You will be logged out.')) {
      dispatch(deleteProfile());
    }
  };

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-2xl font-semibold mb-4">My Profile</h1>

      <div className="mb-6 space-y-2">
        <p><span className="text-gray-500">Name:</span> {user?.name}</p>
        <p><span className="text-gray-500">Email:</span> {user?.email}</p>
        <p><span className="text-gray-500">Role:</span> {user?.role}</p>
      </div>

      <Link
        to="/my-profile/edit"
        className="inline-block bg-blue-600 text-white rounded px-4 py-2"
      >
        Edit Profile
      </Link>

      <Link
  to="/profile/password"
  className="inline-block ml-3 border rounded px-4 py-2"
>
  Change Password
</Link>

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

      <div className="mt-8">
        <button
          onClick={handleDeactivate}
          disabled={loading}
          className="bg-red-600 text-white rounded px-4 py-2 disabled:opacity-50"
        >
          Deactivate account
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;