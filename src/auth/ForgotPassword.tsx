import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function ForgotPassword() {
  const [step, setStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle Step 1: Check if user exists
  const handleVerifyUser = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!identifier) return;
    setIsLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('usersDB') || '[]');
      const user = users.find((u: any) => u.email === identifier.trim() || u.username === identifier.trim());

      if (user) {
        setStep(2);
      } else {
        setError('User not found. Check your username/email.');
      }
      setIsLoading(false);
    }, 600);
  };

  // Handle Step 2: Validate Security Answer
  const handleVerifyAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!securityAnswer) return;
    setIsLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('usersDB') || '[]');
      const user = users.find((u: any) => u.email === identifier.trim() || u.username === identifier.trim());

      if (user && user.securityAnswer === securityAnswer.toLowerCase().trim()) {
        // Success: Allow password reset access
        navigate('/auth/reset-password', { state: { authorized: true, userId: user.id } });
      } else {
        setError('Incorrect security answer.');
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-wide mb-2">
            <span className="text-primary">Password</span> Recovery
          </h1>
          <p className="text-gray-400">
            {step === 1 ? "Enter your details to find your account." : "Answer your security question to proceed."}
          </p>
        </div>

        <div className="glass-card p-8">
          {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center animate-in slide-in-from-top-2">{error}</div>}

          {step === 1 && (
            <form onSubmit={handleVerifyUser} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Username or Email</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="alice123 or alice@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className={`w-full btn-primary py-3 text-lg mt-4 flex items-center justify-center gap-2 ${(!identifier || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading || !identifier}
              >
                {isLoading ? <span className="animate-spin h-5 w-5 border-t-2 border-b-2 border-black rounded-full"></span> : 'Find Account'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyAnswer} className="space-y-5 animate-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Security Question: <span className="text-primary font-semibold">What is your favourite subject?</span>
                </label>
                <input 
                  type="text" 
                  className="input-field mt-2" 
                  placeholder="Enter your answer"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className={`w-full btn-primary py-3 text-lg mt-4 flex items-center justify-center gap-2 ${(!securityAnswer || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading || !securityAnswer}
              >
                {isLoading ? <span className="animate-spin h-5 w-5 border-t-2 border-b-2 border-black rounded-full"></span> : 'Verify Answer'}
              </button>
              
              <div className="text-center mt-4">
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Back to search
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-400">
            Remember your password? <Link to="/auth/login" className="text-primary hover:text-cyan-300 transition-colors">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
