import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { validatePassword } from './Signup';

export function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [pwdValidations, setPwdValidations] = useState({ length: false, uppercase: false, number: false, special: false });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const authorized = location.state?.authorized;
  const userId = location.state?.userId;

  useEffect(() => {
    // Access Control Component logic
    // Do NOT allow password reset without route authorization
    if (!authorized || !userId) {
      navigate('/auth/login', { replace: true });
    }
  }, [authorized, userId, navigate]);

  useEffect(() => {
    setPwdValidations(validatePassword(newPassword));
  }, [newPassword]);

  const isValidPassword = Object.values(pwdValidations).every(Boolean);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPassword) {
      setError('Please ensure your password meets all strong security requirements.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('usersDB') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === userId);

      if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('usersDB', JSON.stringify(users));
        navigate('/auth/login', { state: { message: 'Password reset completely successful! You can now log in.' } });
      } else {
        setError('Error: User context lost. Please try again.');
        setIsLoading(false);
      }
    }, 800);
  };

  if (!authorized) return null; // Avoid rendering if redirecting

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-wide mb-2">
            <span className="text-primary">Reset</span> Password
          </h1>
          <p className="text-gray-400">Verification complete. Enter your new secure password.</p>
        </div>

        <div className="glass-card p-8">
          {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center animate-in slide-in-from-top-2">{error}</div>}

          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
              <input 
                type="password" 
                className={`input-field ${newPassword && !isValidPassword ? 'border-amber-500/50 focus:border-amber-500/50 hover:border-amber-500/50' : ''}`} 
                placeholder="Create a strong password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              
              {/* Validation Requirements UI */}
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

            <button 
              type="submit" 
              className={`w-full btn-primary py-3 text-lg mt-4 flex items-center justify-center gap-2 ${(!isValidPassword || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading || !isValidPassword}
            >
              {isLoading ? <span className="animate-spin h-5 w-5 border-t-2 border-b-2 border-black rounded-full"></span> : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
