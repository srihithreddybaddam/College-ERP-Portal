import { useNavigate } from 'react-router-dom';
import { User, GraduationCap, Shield, ArrowRight } from 'lucide-react';

export function Welcome() {
  const navigate = useNavigate();

  const handleSelectRole = (role: string) => {
    navigate('/auth/login', { state: { targetRole: role } });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
            Uni
          </span>
          Portal
        </h1>
        <p className="text-lg text-gray-400 max-w-lg mx-auto">
          Welcome to the centralized university management system. 
          Please select your portal to continue.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl z-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
        {/* Student Card */}
        <button 
          onClick={() => handleSelectRole('Student')}
          className="group relative h-72 glass-card p-8 flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:border-primary/50"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-primary/50 group-hover:text-primary transition-all duration-500 text-gray-300">
            <User size={36} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Student</h2>
          <p className="text-sm text-gray-400">View grades, subjects, and track attendance.</p>
          <div className="mt-8 flex items-center gap-2 text-primary opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 font-medium">
            Enter Portal <ArrowRight size={16} />
          </div>
        </button>

        {/* Teacher Card */}
        <button 
          onClick={() => handleSelectRole('Teacher')}
          className="group relative h-72 glass-card p-8 flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(167,139,250,0.2)] hover:border-purple-500/50"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-purple-500/50 group-hover:text-purple-400 transition-all duration-500 text-gray-300">
            <GraduationCap size={36} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Teacher</h2>
          <p className="text-sm text-gray-400">Manage student marks, attendance, and classes.</p>
          <div className="mt-8 flex items-center gap-2 text-purple-400 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 font-medium">
            Enter Portal <ArrowRight size={16} />
          </div>
        </button>

        {/* Admin Card */}
        <button 
          onClick={() => handleSelectRole('Admin')}
          className="group relative h-72 glass-card p-8 flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(240,171,252,0.2)] hover:border-fuchsia-500/50"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-fuchsia-500/50 group-hover:text-fuchsia-400 transition-all duration-500 text-gray-300">
            <Shield size={36} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Admin</h2>
          <p className="text-sm text-gray-400">System configuration and user management.</p>
          <div className="mt-8 flex items-center gap-2 text-fuchsia-400 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 font-medium">
            Enter Portal <ArrowRight size={16} />
          </div>
        </button>
      </div>

      <div className="absolute bottom-8 text-gray-600 text-sm font-medium z-10 w-full text-center">
        &copy; {new Date().getFullYear()} UniPortal Architecture. Secure Authentication Verified.
      </div>
    </div>
  );
}
