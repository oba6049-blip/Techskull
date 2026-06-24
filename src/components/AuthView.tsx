import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  BookOpen, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  Shield,
  KeyRound,
  CheckSquare,
  CheckCircle2
} from 'lucide-react';

interface AuthViewProps {
  initialTab: 'login' | 'register';
  onAuthSuccess: (userProfile: any) => void;
  onCancel: () => void;
}

export default function AuthView({ initialTab, onAuthSuccess, onCancel }: AuthViewProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [role, setRole] = useState<'student' | 'admin'>('student');
  
  // Fields state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [adminCode, setAdminCode] = useState('TS-ADMIN-2026');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // First-time admin password setup states
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false);
  const [setupPassword, setSetupPassword] = useState('');
  const [confirmSetupPassword, setConfirmSetupPassword] = useState('');
  const [setupSuccess, setSetupSuccess] = useState('');

  const [showSetupModal, setShowSetupModal] = useState(false);
  const [setupCallbackUrl, setSetupCallbackUrl] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Register parent event receiver for the standalone browser Google Auth popup context
  useEffect(() => {
    const handleGoogleSSOMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (origin !== window.location.origin && !origin.endsWith('.run.app') && !origin.endsWith('.vercel.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return;
      }

      if (event.data) {
        if (event.data.type === 'GOOGLE_SSO_SUCCESS') {
          onAuthSuccess(event.data.user);
        } else if (event.data.type === 'GOOGLE_SSO_FAILURE') {
          setErrorMessage(event.data.error || 'Google SSO login process cancelled.');
        }
      }
    };

    window.addEventListener('message', handleGoogleSSOMessage);
    return () => {
      window.removeEventListener('message', handleGoogleSSOMessage);
    };
  }, [onAuthSuccess]);

  // Google SSO centered standalone window launcher
  const handleGoogleSSOTrigger = async () => {
    setErrorMessage('');
    try {
      const response = await fetch(`/api/auth/google/url?role=${role}`);
      const data = await response.json();
      
      if (!response.ok) {
        if (data.error === 'MISSING_CREDENTIALS') {
          setSetupCallbackUrl(data.callbackUrl || `${window.location.origin}/api/auth/google/callback`);
          setShowSetupModal(true);
        } else {
          throw new Error(data.message || 'Failed to request Google auth endpoint.');
        }
        return;
      }

      const { url } = data;
      const width = 520;
      const height = 650;
      // Calculate coordinates to center popup on current screen
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        url,
        'google_sso_popup',
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
      );

      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        setErrorMessage('Popup window was blocked by your browser. Please allow popups to log in using Google.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to initialize authentic Google SSO connection.');
    }
  };

  // Default credentials for testing
  const handleDemoStudentLogin = () => {
    onAuthSuccess({
      role: 'student',
      name: "Alex Mercer",
      email: "alex.mercer@techskull.edu",
      studentId: "TS-2026-8809",
      department: "Computer Science & Engineering",
      registeredCourses: [],
      completedAssignments: {}
    });
  };

  const handleDemoAdminLogin = () => {
    onAuthSuccess({
      role: 'admin',
      name: "Adeyemi Faridah",
      email: "adeyemifaridah23@gmail.com",
      employeeId: "ADM-2026-9901",
      department: "Computer Science & Engineering"
    });
  };

  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (activeTab === 'register') {
      if (!name || !email || !password) {
        setErrorMessage('All standard registration fields must be filled.');
        return;
      }
      if (!agreedToTerms) {
        setErrorMessage(
          role === 'student'
            ? 'You must approve the student conduct registration policies.'
            : 'You must sign the administrator security policy terms.'
        );
        return;
      }

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role, department })
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to complete registration on backend.');
        }
        onAuthSuccess(data.user);
      } catch (err: any) {
        setErrorMessage(err.message || 'Error occurred during registration connect.');
      }
    } else {
      if (!email || !password) {
        setErrorMessage('Please state your institutional email and passkey token.');
        return;
      }

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role })
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to authenticate user.');
        }

        if (data.needsPasswordSetup) {
          setNeedsPasswordSetup(true);
          return;
        }

        onAuthSuccess(data.user);
      } catch (err: any) {
        setErrorMessage(err.message || 'Error occurred during authenticate connect.');
      }
    }
  };

  const handlePasswordSetupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSetupSuccess('');

    if (!setupPassword || !confirmSetupPassword) {
      setErrorMessage('Please fill in both password fields.');
      return;
    }

    if (setupPassword !== confirmSetupPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    try {
      const response = await fetch('/api/auth/setup-admin-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: setupPassword })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to register password.');
      }

      setSetupSuccess('Password registered successfully! Logging you in...');
      setTimeout(() => {
        onAuthSuccess(data.user);
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving new administrator password.');
    }
  };


  return (
    <section className="min-h-screen relative pt-24 pb-12 sm:pb-24 bg-slate-50 flex items-center justify-center overflow-hidden">
      {/* Background circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#13294B]/10 rounded-full filter blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#41B883]/10 rounded-full filter blur-3xl -z-10" />

      <div className="w-full max-w-lg mx-auto px-4 z-10 transition-all">
        
        {/* Navigation back and header logo */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center space-x-2 cursor-pointer justify-center" onClick={onCancel}>
            <div className="p-2.5 bg-[#13294B] rounded-xl text-[#41B883]">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-sans font-bold text-2xl tracking-tight text-[#13294B] flex items-center gap-1">
              Tech<span className="text-[#41B883]">Skull</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
            {role === 'student' ? 'Student Portal Gateway' : 'Institutional Admin Console'}
          </p>
        </div>

        {/* Outer Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 relative">
          
          {needsPasswordSetup ? (
            <form onSubmit={handlePasswordSetupSubmit} className="space-y-5">
              <div className="space-y-1 text-center">
                <div className="inline-flex p-3 bg-amber-50 rounded-2xl text-amber-600 mb-2">
                  <KeyRound className="w-6 h-6 text-amber-500 animate-pulse" />
                </div>
                <h3 className="text-base font-extrabold text-[#13294B]">First-Time Administrator Setup</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Welcome to TechSkull! Your account has been registered by an existing administrator. Please create a secure password to activate your command console.
                </p>
                <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-mono text-slate-600 inline-block mt-2">
                  {email}
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium flex items-center space-x-2">
                  <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {setupSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-medium flex items-center space-x-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                  <span>{setupSuccess}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Password Field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#13294B] block uppercase tracking-wider">Create Secure Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <Lock className="w-4.5 h-4.5" />
                    </span>
                    <input
                      type="password"
                      required
                      placeholder="Enter new password"
                      value={setupPassword}
                      onChange={(e) => setSetupPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#41B883] focus:border-[#41B883] text-sm text-gray-800 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#13294B] block uppercase tracking-wider">Confirm Secure Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <Lock className="w-4.5 h-4.5" />
                    </span>
                    <input
                      type="password"
                      required
                      placeholder="Verify your password"
                      value={confirmSetupPassword}
                      onChange={(e) => setConfirmSetupPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#41B883] focus:border-[#41B883] text-sm text-gray-800 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-3 bg-[#13294B] hover:bg-[#1E4F8A] text-white font-bold rounded-xl tracking-wide shadow-md transition-all cursor-pointer text-sm"
              >
                <span>Save Password & Log In</span>
                <ArrowRight className="w-4 h-4 text-[#41B883]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setNeedsPasswordSetup(false);
                  setErrorMessage('');
                  setSetupPassword('');
                  setConfirmSetupPassword('');
                }}
                className="w-full py-2 bg-transparent border border-gray-150 text-gray-500 font-bold rounded-xl text-xs hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Go Back to Sign In
              </button>
            </form>
          ) : (
            <>
              {/* Quick Tab Header selection */}
              <div className="flex border-b border-gray-100 mb-6 pb-1">
                <button
                  onClick={() => { setActiveTab('login'); setErrorMessage(''); }}
                  className={`flex-1 text-center pb-3 text-base font-bold transition-all relative ${
                    activeTab === 'login' ? 'text-[#13294B]' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <span>Sign In</span>
                  {activeTab === 'login' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#13294B] rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => { setActiveTab('register'); setErrorMessage(''); }}
                  className={`flex-1 text-center pb-3 text-base font-bold transition-all relative ${
                    activeTab === 'register' ? 'text-[#13294B]' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <span>Create Account</span>
                  {activeTab === 'register' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#13294B] rounded-full" />
                  )}
                </button>
              </div>

              {/* Role Toggler Selection */}
              <div className="space-y-1 mb-5">
                <label className="text-[10px] font-bold text-[#13294B] block uppercase tracking-wider mb-1.5">Portal Authority Role</label>
                <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === 'student' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-accent" />
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === 'admin' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-royal" />
                    <span>Administrator</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium flex items-center space-x-2">
                    <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Google Sign-in Trigger button */}
                <button
                   type="button"
                   onClick={handleGoogleSSOTrigger}
                   className="w-full py-3 px-4 border border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-xl text-sm flex items-center justify-center gap-2 bg-white transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-98"
                >
                  {/* Custom High Polished Google 'G' icon matching style */}
                  <svg className="w-4.5 h-4.5 text-current shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.642 1.09 14.974 0 12 0 7.354 0 3.307 2.67 1.332 6.56l3.934 3.205z"
                    />
                    <path
                      fill="#4285F4"
                      d="M16.04 15.345c-1.077.733-2.5 1.155-4.04 1.155-2.927 0-5.397-1.89-6.38-4.507L1.442 15.1c2.11 4.18 6.458 7.02 11.458 7.02 2.91 0 5.666-.99 7.747-2.784l-4.607-3.991z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.62 11.993c0-.623.109-1.22.311-1.782L1.997 7.006A11.906 11.906 0 000 12c0 1.76.381 3.442 1.056 4.966l4.896-3.805a7.17 7.17 0 01-.33-1.168z"
                    />
                    <path
                      fill="#34A853"
                      d="M23.51 12.303c0-.8-.1-1.57-.25-2.3H12v4.54h6.47c-.28 1.48-1.12 2.73-2.39 3.58l4.61 3.99c2.69-2.48 4.22-6.14 4.22-10.21z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-100"></div>
                  <span className="flex-shrink mx-4 text-2xs text-gray-400 font-bold uppercase tracking-wider">Or Use Passkey Token</span>
                  <div className="flex-grow border-t border-gray-100"></div>
                </div>

                {/* Name Input Group */}
                {activeTab === 'register' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#13294B] block uppercase tracking-wider">
                      {role === 'admin' ? 'Full Registrar Name' : 'Full Student Name'}
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <User className="w-4.5 h-4.5" />
                      </span>
                      <input
                        type="text"
                        required
                        placeholder={role === 'admin' ? 'e.g. Adeyemi Faridah' : 'e.g. Alex Mercer'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#41B883] focus:border-[#41B883] text-sm text-gray-800 transition-all outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#13294B] block uppercase tracking-wider">
                    {role === 'admin' ? 'Administrative Institutional Email' : 'University Academic Email'}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <Mail className="w-4.5 h-4.5" />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder={role === 'admin' ? 'adeyemifaridah23@gmail.com' : 'mercer@techskull.edu'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#41B883] focus:border-[#41B883] text-sm text-gray-800 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#13294B] block uppercase tracking-wider">Passkey Security Token</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <Lock className="w-4.5 h-4.5" />
                    </span>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#41B883] focus:border-[#41B883] text-sm text-gray-800 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Department selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#13294B] block uppercase tracking-wider">
                    {role === 'admin' ? 'Authorized Department Division' : 'Academic Focus Major'}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <BookOpen className="w-4.5 h-4.5" />
                    </span>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#41B883] focus:border-[#41B883] text-sm text-gray-800 bg-white transition-all outline-none appearance-none"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Information Security">Information Security & Cyberops</option>
                      <option value="Information Design & Human Experience">UI/UX Graphic Design</option>
                      <option value="Advanced Neural Networks & Models">Artificial Intelligence & ML</option>
                    </select>
                  </div>
                </div>

                {/* Admin Security Verification Key */}
                {activeTab === 'register' && role === 'admin' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#13294B] block uppercase tracking-wider">System Administration Code</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <KeyRound className="w-4.5 h-4.5" />
                      </span>
                      <input
                        type="text"
                        placeholder="TS-ADMIN-2026"
                        value={adminCode}
                        onChange={(e) => setAdminCode(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#41B883] focus:border-[#41B883] text-sm text-gray-700 font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Terms checkboxes */}
                {activeTab === 'register' && (
                  <div className="flex items-start space-x-2 pt-1">
                    <input
                      id="agreed"
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 text-[#13294B] rounded border-gray-300 focus:ring-none cursor-pointer"
                    />
                    <label htmlFor="agreed" className="text-2xs text-gray-500 font-semibold cursor-pointer leading-tight select-none">
                      {role === 'admin'
                        ? 'I swear statutory fidelity and pledge compliance with institutional guidelines regarding student personal privacy acts.'
                        : 'I hereby pledge adherence to the TechSkull Student Honor Code and general network credentials management guidelines.'}
                    </label>
                  </div>
                )}

                {/* Submit Trigger Button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-[#13294B] hover:bg-[#1E4F8A] text-white font-bold rounded-xl tracking-wide shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer text-sm"
                >
                  <span>
                    {activeTab === 'register' 
                      ? (role === 'admin' ? 'Create Admin Console' : 'Register Student Account')
                      : (role === 'admin' ? 'Authenticate Command Console' : 'Sign into Portal')
                    }
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#41B883]" />
                </button>

                {/* Return Button */}
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full py-2 bg-transparent border border-gray-150 text-gray-500 font-bold rounded-xl text-xs hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel & Return Home
                </button>

              </form>
            </>
          )}
        </div>

      </div>

      {/* REAL GOOGLE AUTH SETUP MODAL */}
      <AnimatePresence>
        {showSetupModal && (
          <div className="fixed inset-0 bg-[#13294B]/60 backdrop-blur-xs flex items-center justify-center p-4 z-55">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xl w-full max-w-lg space-y-5 text-left"
            >
              {/* Header block */}
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-150">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-sm text-[#13294B]">Google Sign-in Integration Setup</h3>
                    <p className="text-[10px] text-gray-400 font-medium">Real secure Google OAuth credentials setup guide</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowSetupModal(false);
                    setCopiedUrl(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 font-bold p-1 hover:bg-gray-100 rounded-lg cursor-pointer animate-none"
                >
                  ✕
                </button>
              </div>

              {/* Instructions body */}
              <div className="space-y-4 text-xs text-gray-600 font-medium leading-relaxed">
                <p>
                  To enable live real Google authentication inside this application, you must configure a Google OAuth Application under your Google Cloud Console.
                </p>

                <div className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="font-extrabold text-[#13294B] text-2xs uppercase tracking-wider flex items-center gap-1.5 leading-none">
                    <span className="w-4 h-4 rounded-full bg-[#13294B] text-white flex items-center justify-center text-[10px]">1</span>
                    Step 1: Obtain Google Credentials
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-gray-500 text-[11px]">
                    <li>Go to the <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-royal hover:underline font-bold">Google Cloud Credentials Console</a>.</li>
                    <li>Create an <strong>OAuth 2.0 Web Application Client ID</strong>.</li>
                  </ul>
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="font-extrabold text-[#13294B] text-2xs uppercase tracking-wider flex items-center gap-1.5 leading-none">
                    <span className="w-4 h-4 rounded-full bg-[#13294B] text-white flex items-center justify-center text-[10px]">2</span>
                    Step 2: Add Authorized Redirect URI
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Add the following URL as an <strong>Authorized redirect URI</strong> inside your client configuration:
                  </p>
                  <div className="flex gap-2 items-center bg-white p-2.5 rounded-xl border border-gray-150">
                    <code className="text-[10px] font-mono text-gray-700 bg-slate-50 px-1.5 py-0.5 rounded border border-gray-100 truncate flex-1 block">
                      {setupCallbackUrl}
                    </code>
                    <button
                      type="button"
                      onClick={() => {
                        void navigator.clipboard.writeText(setupCallbackUrl);
                        setCopiedUrl(true);
                        setTimeout(() => setCopiedUrl(false), 2000);
                      }}
                      className={`text-2xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer select-none ${
                        copiedUrl ? 'bg-emerald-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-gray-700'
                      }`}
                    >
                      {copiedUrl ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="font-extrabold text-[#13294B] text-2xs uppercase tracking-wider flex items-center gap-1.5 leading-none">
                    <span className="w-4 h-4 rounded-full bg-[#13294B] text-white flex items-center justify-center text-[10px]">3</span>
                    Step 3: Define Secrets in Environment
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-normal">
                    Open the <strong>Environment Settings</strong> panel in your AI Studio editor (the gear or sliders icon) and add these two runtime environment variables:
                  </p>
                  <div className="space-y-1.5 text-[10px] font-mono list-none text-left pl-1">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="bg-gray-200 font-bold px-1 rounded">GOOGLE_CLIENT_ID</span>
                      <span>= [Your Google ID]</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="bg-gray-200 font-bold px-1 rounded">GOOGLE_CLIENT_SECRET</span>
                      <span>= [Your Google Secret]</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowSetupModal(false)}
                  className="px-5 py-2 bg-[#13294B] hover:bg-[#1E4F8A] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  I've Configured These Keys
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
