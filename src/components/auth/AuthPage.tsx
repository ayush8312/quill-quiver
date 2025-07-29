import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { OtpForm } from './OtpForm';

export type AuthMode = 'signin' | 'signup' | 'otp';

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [otpEmail, setOtpEmail] = useState('');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-variant items-center justify-center p-12">
        <div className="text-center text-primary-foreground">
          <h1 className="text-4xl font-bold mb-4">Welcome to QuillQuiver</h1>
          <p className="text-xl opacity-90 mb-8">Your thoughts, organized and secure</p>
          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <p className="text-lg">✨ Create and manage your notes</p>
            <p className="text-lg">🔒 Secure and private</p>
            <p className="text-lg">📱 Access anywhere</p>
          </div>
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {mode === 'signin' && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'otp' && 'Enter OTP'}
            </h2>
            <p className="text-muted-foreground">
              {mode === 'signin' && 'Welcome back! Please sign in to your account'}
              {mode === 'signup' && 'Join us today and start organizing your thoughts'}
              {mode === 'otp' && 'Enter the verification code sent to your email'}
            </p>
          </div>

          {mode === 'signin' && (
            <SignInForm
              onSwitchToSignUp={() => setMode('signup')}
              onSwitchToOtp={(email) => {
                setOtpEmail(email);
                setMode('otp');
              }}
            />
          )}

          {mode === 'signup' && (
            <SignUpForm
              onSwitchToSignIn={() => setMode('signin')}
              onSwitchToOtp={(email) => {
                setOtpEmail(email);
                setMode('otp');
              }}
            />
          )}

          {mode === 'otp' && (
            <OtpForm
              email={otpEmail}
              onBack={() => setMode('signin')}
            />
          )}
        </div>
      </div>
    </div>
  );
}