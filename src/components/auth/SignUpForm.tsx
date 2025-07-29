import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUp, signInWithGoogle, sendOtp } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { Chrome } from 'lucide-react';

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  onSwitchToOtp: (email: string) => void;
}

export function SignUpForm({ onSwitchToSignIn, onSwitchToOtp }: SignUpFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data, error } = await signUp(email, password);
      
      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            title: "Account Exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
        } else if (error.message.includes('Password should be at least')) {
          toast({
            title: "Weak Password",
            description: "Password should be at least 6 characters long",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        if (data.user && !data.session) {
          toast({
            title: "Check Your Email",
            description: "We've sent you a confirmation link. Please check your email to complete registration.",
          });
        } else {
          toast({
            title: "Welcome!",
            description: "Your account has been created successfully",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign up with Google",
        variant: "destructive",
      });
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email first",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setOtpLoading(true);
    try {
      const { error } = await sendOtp(email);
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "OTP Sent",
          description: "Check your email for the verification code",
        });
        onSwitchToOtp(email);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP",
        variant: "destructive",
      });
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <div className="space-y-3">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignUp}
        >
          <Chrome className="mr-2 h-4 w-4" />
          Sign up with Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleSendOtp}
          disabled={otpLoading}
        >
          {otpLoading ? 'Sending...' : 'Sign up with OTP'}
        </Button>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="text-sm text-primary hover:underline"
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  );
}