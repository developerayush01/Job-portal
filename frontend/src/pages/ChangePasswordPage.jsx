import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, clearError } from '../features/auth/authSlice';

function ChangePasswordPage() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [localError, setLocalError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setMessage('');

    if (formData.newPassword !== formData.confirmPassword) {
      setLocalError('New passwords do not match');
      return;
    }

    const result = await dispatch(
      changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      })
    );

    if (changePassword.fulfilled.match(result)) {
      setMessage('Password changed successfully');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Change Password</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={handleChange}
          placeholder="Current password"
          className="w-full border rounded px-3 py-2 mb-3"
        />
        <input
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="New password"
          className="w-full border rounded px-3 py-2 mb-3"
        />
        <input
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
          >
            {loading ? 'Changing...' : 'Change password'}
          </button>
          <Link to="/profile" className="text-sm text-gray-600">Back to profile</Link>
        </div>
      </form>

      {message && <p className="text-green-600 text-sm mt-3">{message}</p>}
      {(localError || error) && (
        <p className="text-red-500 text-sm mt-3">{localError || error}</p>
      )}
    </div>
  );
}

export default ChangePasswordPage;