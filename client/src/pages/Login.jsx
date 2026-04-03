import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userStr = params.get('user');
    const urlError = params.get('error');

    if (urlError) {
      setError('Failed to authenticate with GitHub');
      // Clean up url explicitly
      window.history.replaceState({}, document.title, '/login');
      return;
    }

    if (token && userStr) {
      try {
        const userData = JSON.parse(decodeURIComponent(userStr));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Use window.location.href to cause a reload to re-initialize React state 
        // with the token safely.
        const dashboardPaths = {
          student: '/student/dashboard',
          teacher: '/teacher/dashboard',
          admin: '/admin/dashboard',
          alumni: '/student/dashboard',
          higherofficial: '/admin/dashboard',
        };
        window.location.href = dashboardPaths[userData.role] || '/student/dashboard';
      } catch (err) {
        setError('Error completing login');
      }
    }
  }, []);

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

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-text-muted">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => window.location.href = 'http://localhost:5000/api/auth/github'}
                className="w-full h-12 text-base bg-[#24292e] hover:bg-[#2f363d] text-white flex items-center justify-center gap-2 transition-colors border-none"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                Sign in with GitHub
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
