import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { COLLEGES } from '../utils/colleges';

export function Login() {
  const [formData, setFormData] = useState({ identifier: '', password: '', collegeName: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const targetRole = location.state?.targetRole;

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      window.history.replaceState({}, document.title); // clear state
    }
  }, [location]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!formData.identifier || !formData.password || !formData.collegeName) {
      setError('Please fill out all fields.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('usersDB') || '[]');
      
      const foundUser = users.find((u: any) => 
        (u.email === formData.identifier.trim() || u.username === formData.identifier.trim()) && 
        u.password === formData.password
      );

      if (foundUser) {
        if (foundUser.collegeName !== formData.collegeName) {
          setError(`Unauthorized Access. This account belongs to ${foundUser.collegeName}, not the selected college.`);
          setIsLoading(false);
          return;
        }

        if (targetRole && foundUser.role !== targetRole) {
          setError(`Unauthorized Access. You must use the ${foundUser.role} portal.`);
          setIsLoading(false);
          return;
        }

        const { password, securityAnswer, ...userProfile } = foundUser;
        login(userProfile);

        if (foundUser.role !== 'Admin') {
          const adminNotifs = JSON.parse(localStorage.getItem('notificationQueue') || '[]');
          adminNotifs.push({ 
            id: Math.random().toString(36).substr(2, 9), 
            user: foundUser.name, 
            action: 'Logged In', 
            timestamp: Date.now(),
            collegeName: foundUser.collegeName 
          });
          localStorage.setItem('notificationQueue', JSON.stringify(adminNotifs));
        }
        
        if (foundUser.role === 'Admin') navigate('/dashboard/admin');
        else if (foundUser.role === 'Teacher') navigate('/dashboard/teacher');
        else navigate('/dashboard/student');
      } else {
        // More descriptive error
        const userExists = users.some((u: any) => u.email === formData.identifier || u.username === formData.identifier);
        if (userExists) setError('Incorrect password. Please try again.');
        else setError('User not found. Check your username/email or sign up.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-wide mb-2">
            <span className="text-primary">Uni</span>Portal
          </h1>
          <p className="text-gray-400">
            {targetRole ? `Welcome to the ${targetRole} Portal.` : 'Welcome back! Please login to your account.'}
          </p>
        </div>

        <div className="glass-card p-8">
          {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center animate-in slide-in-from-top-2">{error}</div>}
          {message && <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm text-center animate-in zoom-in">{message}</div>}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select College</label>
              <select
                className="input-field appearance-none bg-[#0a0a0a]"
                value={formData.collegeName}
                onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                required
              >
                <option value="" className="bg-[#111] text-gray-400">Choose a college...</option>
                {COLLEGES.map((college) => (
                  <option key={college} value={college} className="bg-[#111] text-white">
                    {college}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username or Email</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="alice123 or alice@example.com"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                required
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <Link to="/auth/forgot-password" className="text-sm text-primary hover:text-cyan-300 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <input 
                type="password" 
                className="input-field" 
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <button 
              type="submit" 
              className={`w-full btn-primary py-3 text-lg mt-4 flex items-center justify-center gap-2 ${(!formData.identifier || !formData.password || !formData.collegeName || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading || !formData.identifier || !formData.password || !formData.collegeName}
            >
              {isLoading ? <span className="animate-spin h-5 w-5 border-t-2 border-b-2 border-black rounded-full"></span> : 'Login to Portal'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account? <Link to="/auth/signup" state={{ targetRole }} className="text-primary hover:text-cyan-300 transition-colors">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
