import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { User, GraduationCap, Shield, Check, X } from 'lucide-react';
import { COLLEGES } from '../utils/colleges';

export const validatePassword = (pwd: string) => {
  return {
    length: pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    special: /[^A-Za-z0-9]/.test(pwd),
  };
};

export function Signup() {
  const location = useLocation();
  const targetRole = location.state?.targetRole as 'Student' | 'Teacher' | 'Admin' | undefined;
  
  const [role, setRole] = useState<'Student' | 'Teacher' | 'Admin'>(targetRole || 'Student');
  const [formData, setFormData] = useState({ 
    name: '', 
    username: '', 
    email: '', 
    password: '',
    securityAnswer: '',
    collegeName: ''
  });
  const [pwdValidations, setPwdValidations] = useState({ length: false, uppercase: false, number: false, special: false });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setPwdValidations(validatePassword(formData.password));
  }, [formData.password]);

  const isValidPassword = Object.values(pwdValidations).every(Boolean);
  const isFormValid = formData.name && formData.username && formData.email && isValidPassword && formData.securityAnswer && formData.collegeName;

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isFormValid) {
      setError('Please properly fill out all required fields.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('usersDB') || '[]');
      
      const exists = users.find((u: any) => u.email === formData.email || u.username === formData.username);
      if (exists) {
        setError('Username or Email already exists. Please pick another or login.');
        setIsLoading(false);
        return;
      }

      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password, // Plain text for mock tracking
        securityAnswer: formData.securityAnswer.toLowerCase().trim(),
        role,
        collegeName: formData.collegeName,
      };

      users.push(newUser);
      localStorage.setItem('usersDB', JSON.stringify(users));

      const adminNotifs = JSON.parse(localStorage.getItem('notificationQueue') || '[]');
      adminNotifs.push({ 
        id: Math.random().toString(36).substr(2, 9), 
        user: newUser.name, 
        action: 'Signed Up', 
        timestamp: Date.now(),
        collegeName: newUser.collegeName 
      });
      localStorage.setItem('notificationQueue', JSON.stringify(adminNotifs));

      setIsLoading(false);
      navigate('/auth/login', { state: { message: 'Registration successful! Please log in.' } });
    }, 800);
  };

  const roles = [
    { id: 'Teacher', icon: GraduationCap },
    { id: 'Student', icon: User },
    { id: 'Admin', icon: Shield },
  ] as const;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-lg animate-in fade-in zoom-in duration-500 z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-wide mb-2">
            <span className="text-primary">Uni</span>Portal
          </h1>
          <p className="text-gray-400">Create a new account to get started.</p>
        </div>

        <div className="glass-card p-8">
          {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">{error}</div>}

          <div className="flex bg-white/5 rounded-xl p-1 mb-6 gap-1">
            {roles.map((r) => (
              <button
                type="button"
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  role === r.id 
                    ? 'bg-primary text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <r.icon size={16} />
                <span className="hidden sm:inline">{r.id}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Alice Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. alice123"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input 
                type="email" 
                className="input-field" 
                placeholder="alice@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Select College</label>
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
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input 
                type="password" 
                className={`input-field ${formData.password && !isValidPassword ? 'border-amber-500/50 focus:border-amber-500/50 focus:ring-amber-500/50' : ''}`} 
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              
              {/* Password Requirements UI */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className={`flex items-center gap-1.5 ${pwdValidations.length ? 'text-green-400' : 'text-gray-500'}`}>
                  {pwdValidations.length ? <Check size={14} /> : <X size={14} />} Min 8 characters
                </div>
                <div className={`flex items-center gap-1.5 ${pwdValidations.uppercase ? 'text-green-400' : 'text-gray-500'}`}>
                  {pwdValidations.uppercase ? <Check size={14} /> : <X size={14} />} 1 Uppercase letter
                </div>
                <div className={`flex items-center gap-1.5 ${pwdValidations.number ? 'text-green-400' : 'text-gray-500'}`}>
                  {pwdValidations.number ? <Check size={14} /> : <X size={14} />} 1 Number
                </div>
                <div className={`flex items-center gap-1.5 ${pwdValidations.special ? 'text-green-400' : 'text-gray-500'}`}>
                  {pwdValidations.special ? <Check size={14} /> : <X size={14} />} 1 Special char
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 mt-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Security Question: <span className="text-primary font-semibold">What is your favourite subject?</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">This will be used for password recovery if you forget your password.</p>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Mathematics"
                value={formData.securityAnswer}
                onChange={(e) => setFormData({ ...formData, securityAnswer: e.target.value })}
                required
              />
            </div>

            <button 
              type="submit" 
              className={`w-full btn-primary py-3 text-lg mt-6 flex items-center justify-center gap-2 ${(!isFormValid || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? <span className="animate-spin h-5 w-5 border-t-2 border-b-2 border-black rounded-full"></span> : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account? <Link to="/auth/login" className="text-primary hover:text-cyan-300 transition-colors">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
