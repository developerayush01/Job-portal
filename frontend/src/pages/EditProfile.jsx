import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, clearError } from '../features/auth/authSlice';

function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailChanged = formData.email !== user?.email;
    if (
      emailChanged &&
      !window.confirm('Changing your email logs you out until the new address is verified. Continue?')
    ) {
      return;
    }

    const result = await dispatch(updateProfile(formData));

    if (updateProfile.fulfilled.match(result) && !result.payload.emailChanged) {
      navigate('/profile');
    }
  };

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Edit Profile</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border rounded px-3 py-2 mb-3"
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border rounded px-3 py-2 mb-1"
        />
        <p className="text-xs text-gray-500 mb-4">
          Changing your email requires verifying the new address.
        </p>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save changes'}
          </button>
          <Link to="/profile" className="text-sm text-gray-600">Cancel</Link>
        </div>
      </form>

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
    </div>
  );
}

export default EditProfile;