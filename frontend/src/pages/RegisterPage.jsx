import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/auth/authSlice';

function RegisterPage() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6">Register</h2>

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
          className="w-full border rounded px-3 py-2 mb-3"
        />
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded py-2 disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </form>
    </div>
  );
}

export default RegisterPage;