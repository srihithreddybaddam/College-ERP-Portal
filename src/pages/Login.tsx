import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, GraduationCap, Shield } from 'lucide-react';

export function Login() {
  const [role, setRole] = useState<'Student' | 'Teacher' | 'Admin'>('Admin');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const roles = [
    { id: 'Teacher', icon: GraduationCap },
    { id: 'Student', icon: User },
    { id: 'Admin', icon: Shield },
  ] as const;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-wide mb-2">
            <span className="text-primary">Uni</span>Portal
          </h1>
          <p className="text-gray-400">Welcome back! Please login to your account.</p>
        </div>

        <div className="glass-card p-8">
          {/* Role Selection Tabs */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-8 gap-1">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  role === r.id 
                    ? 'bg-primary text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <r.icon size={16} />
                {r.id}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email or Username</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder={`Enter ${role.toLowerCase()} email`}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input 
                type="password" 
                className="input-field" 
                placeholder="Enter password"
                required
              />
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-sm text-primary hover:text-cyan-300 transition-colors">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="w-full btn-primary py-3 text-lg mt-4">
              Login to Portal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
