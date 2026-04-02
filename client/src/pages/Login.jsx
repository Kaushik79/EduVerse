import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { GraduationCap, Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      const role = result.user.role;
      const dashboardPaths = {
        student: '/student/dashboard',
        teacher: '/teacher/dashboard',
        admin: '/admin/dashboard',
        alumni: '/student/dashboard',
        higherofficial: '/admin/dashboard',
      };
      navigate(dashboardPaths[role] || '/student/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #1e3a5f 0%, #152d4a 50%, #0f1f33 100%)'
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-32 right-10 w-48 h-48 rounded-full bg-blue-400/20 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 w-40 h-40 rounded-full bg-indigo-400/15 blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between w-full p-10">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <GraduationCap size={22} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">EduVerse</span>
          </div>

          {/* Tagline */}
          <div className="max-w-md">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              <span className="text-white">Connect.</span>
              <br />
              <span className="text-blue-300 italic">Collaborate.</span>
              <br />
              <span className="text-blue-300 italic">Create.</span>
            </h2>
            <p className="mt-6 text-blue-200/80 text-base leading-relaxed">
              Find teammates for projects & hackathons. Showcase your skills. 
              Manage academics — all in one place.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mt-8">
              {['Team Finder', 'Project Hub', 'Achievements', 'Smart Calendar'].map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full text-xs text-blue-200 font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-6 text-sm text-blue-300/60">
            <span>© 2025 EduVerse</span>
            <a href="#" className="hover:text-blue-200 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-200 transition-colors">Terms</a>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center bg-bg px-6 py-12 relative">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <GraduationCap size={22} className="text-white" />
          </div>
          <span className="text-lg font-bold text-text">EduVerse</span>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-text">Welcome Back</h2>
              <p className="text-sm text-text-secondary mt-2">Sign in with your college credentials</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-danger">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="College Email"
                icon={Mail}
                placeholder="yourname@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                icon={Lock}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex items-center justify-between">
                <Checkbox
                  label="Remember me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <a href="#" className="text-sm text-accent hover:text-accent-light font-medium transition-colors">
                  Forgot Password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Secure Login →'}
              </Button>
            </form>

            <p className="text-center text-sm text-text-muted mt-6">
              Need help accessing your account?{' '}
              <a href="#" className="text-accent hover:text-accent-light font-medium">Contact IT Support</a>
            </p>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm text-text-muted">System Operational</span>
        </div>
      </div>
    </div>
  );
}
