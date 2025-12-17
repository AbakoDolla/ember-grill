import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthScreen() {
  const navigate = useNavigate(); // ✅ CORRECT PLACE

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = () => {
    if (isLogin) {
      console.log('Login:', { email: formData.email, password: formData.password });
      alert('Welcome back to BRAZZAFLAME! 🔥');
      navigate('/menu');
    } else {
      console.log('Signup:', formData);
      alert('Welcome to BRAZZAFLAME! 🔥');
      navigate('/menu');
    }
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4" style={{
      background: '#1a1a1a', paddingTop: '80px'
    }}>
      {/* Animated floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 blur-sm"
            style={{
              width: `${Math.random() * 120 + 40}px`,
              height: `${Math.random() * 120 + 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 
                ? '#ff6b35' 
                : i % 3 === 1 
                ? '#ff8c42' 
                : '#ffa600',
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); }
          25% { transform: translateY(-30px) translateX(20px) scale(1.1); }
          50% { transform: translateY(-60px) translateX(-20px) scale(0.9); }
          75% { transform: translateY(-30px) translateX(20px) scale(1.05); }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>

      <div className="w-full max-w-md relative z-10">
        {/* Main card */}
        <div className="rounded-3xl overflow-hidden backdrop-blur-xl" style={{
          background: 'rgba(45, 45, 45, 0.95)',
          border: '2px solid rgba(255, 107, 53, 0.3)',
          boxShadow: `
            0 0 0 1px rgba(255, 107, 53, 0.2),
            0 20px 60px rgba(0, 0, 0, 0.8),
            0 10px 40px rgba(255, 107, 53, 0.25),
            0 0 100px rgba(255, 107, 53, 0.15)
          `
        }}>
          {/* Header */}
          <div className="relative p-10 text-center overflow-hidden" style={{
            background: 'linear-gradient(135deg, #ff6b35, #ff4820, #d62828)',
            borderBottom: '2px solid rgba(255, 107, 53, 0.3)'
          }}>
            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 shimmer opacity-20"></div>
            
            <div className="relative z-10">
              {/* Logo */}
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl" style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                }}>
                  🔥
                </div>
              </div>
              
              <h1 className="text-4xl font-black text-white mb-2 tracking-tight" style={{
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
              }}>
                BRAZZA<span style={{ color: '#ffa600' }}>FLAME</span>
              </h1>
              <p className="text-white/90 text-base font-semibold">
                {isLogin ? 'Welcome Back' : 'Join the Community'}
              </p>
              <p className="text-white/70 text-sm mt-1">
                {isLogin ? 'Sign in to continue ordering' : 'Create your account to get started'}
              </p>
            </div>
          </div>

          {/* Form section */}
          <div className="p-8">
            <div className="space-y-4">
              {!isLogin && (
                <div className="transform transition-all duration-300">
                  <label className="block text-sm font-bold text-white/90 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-white/40 focus:outline-none transition-all"
                    style={{
                      background: 'rgba(60, 60, 60, 0.8)',
                      border: focusedField === 'name' ? '2px solid #ff6b35' : '2px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: focusedField === 'name' 
                        ? '0 0 0 3px rgba(255, 107, 53, 0.2), 0 4px 16px rgba(0, 0, 0, 0.3)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.2)'
                    }}
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div className="transform transition-all duration-300">
                <label className="block text-sm font-bold text-white/90 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/40 focus:outline-none transition-all"
                  style={{
                    background: 'rgba(60, 60, 60, 0.8)',
                    border: focusedField === 'email' ? '2px solid #ff6b35' : '2px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: focusedField === 'email' 
                      ? '0 0 0 3px rgba(255, 107, 53, 0.2), 0 4px 16px rgba(0, 0, 0, 0.3)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.2)'
                  }}
                  placeholder="your@email.com"
                />
              </div>

              <div className="transform transition-all duration-300">
                <label className="block text-sm font-bold text-white/90 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/40 focus:outline-none transition-all"
                  style={{
                    background: 'rgba(60, 60, 60, 0.8)',
                    border: focusedField === 'password' ? '2px solid #ff6b35' : '2px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: focusedField === 'password' 
                      ? '0 0 0 3px rgba(255, 107, 53, 0.2), 0 4px 16px rgba(0, 0, 0, 0.3)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.2)'
                  }}
                  placeholder="Enter your password"
                />
              </div>

              {!isLogin && (
                <div className="transform transition-all duration-300">
                  <label className="block text-sm font-bold text-white/90 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-white/40 focus:outline-none transition-all"
                    style={{
                      background: 'rgba(60, 60, 60, 0.8)',
                      border: focusedField === 'confirmPassword' ? '2px solid #ff6b35' : '2px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: focusedField === 'confirmPassword' 
                        ? '0 0 0 3px rgba(255, 107, 53, 0.2), 0 4px 16px rgba(0, 0, 0, 0.3)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.2)'
                    }}
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm font-bold transition-all"
                    style={{
                      color: '#ffa600'
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                onClick={handleSubmit}
                className="w-full py-3.5 rounded-xl font-bold text-base text-white transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 relative overflow-hidden group mt-6"
                style={{
                  background: 'linear-gradient(135deg, #ff6b35, #ff4820)',
                  boxShadow: '0 6px 24px rgba(255, 107, 53, 0.4)'
                }}
              >
                <span className="relative z-10">{isLogin ? 'Sign In' : 'Create Account'}</span>
                <span className="text-xl relative z-10">🔥</span>
                <div className="absolute inset-0 shimmer opacity-20"></div>
              </button>
            </div>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <p className="text-white/70 text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-bold transition-all"
                  style={{
                    color: '#ff6b35'
                  }}
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>

            {/* Divider */}
            <div className="mt-6 flex items-center">
              <div className="flex-1 h-px" style={{
                background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.15), transparent)'
              }}></div>
              <span className="px-4 text-xs text-white/40 font-bold tracking-wider">OR</span>
              <div className="flex-1 h-px" style={{
                background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.15), transparent)'
              }}></div>
            </div>

            {/* Social Login */}
            <div className="mt-6 space-y-3">
              <button className="w-full py-3 rounded-xl font-bold text-white backdrop-blur-sm transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3" style={{
                background: 'rgba(60, 60, 60, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
              <button className="w-full py-3 rounded-xl font-bold text-white backdrop-blur-sm transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3" style={{
                background: 'rgba(60, 60, 60, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Continue with Apple
              </button>
            </div>
          </div>
        </div>

        {/* Footer tagline */}
        <div className="mt-6 text-center">
          <p className="text-white/30 text-xs font-medium tracking-wide">
            Fire-Grilled Delicacies • Authentic African Flavors
          </p>
        </div>
      </div>
    </div>
  );
}