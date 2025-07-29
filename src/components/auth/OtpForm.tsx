import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { verifyOtp, sendOtp } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

interface OtpFormProps {
  email: string;
  onBack: () => void;
}

export function OtpForm({ email, onBack }: OtpFormProps) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await verifyOtp(email, otp);
      
      if (error) {
        if (error.message.includes('Token has expired')) {
          toast({
            title: "OTP Expired",
            description: "The OTP has expired. Please request a new one.",
            variant: "destructive",
          });
        } else if (error.message.includes('Invalid token')) {
          toast({
            title: "Invalid OTP",
            description: "Please check the OTP and try again",
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
        toast({
          title: "Success",
          description: "Welcome! You've been signed in successfully",
        });
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

  const handleResendOtp = async () => {
    setResending(true);
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
          description: "A new OTP has been sent to your email",
        });
        setOtp(''); // Clear the current OTP input
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          We've sent a 6-digit verification code to:
        </p>
        <p className="font-medium text-foreground">{email}</p>
      </div>

      <form onSubmit={handleVerifyOtp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            className="text-center tracking-widest text-lg"
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || otp.length !== 6}
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </Button>
      </form>

      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleResendOtp}
          disabled={resending}
        >
          {resending ? 'Sending...' : 'Resend Code'}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Didn't receive the code? Check your spam folder or try resending
        </p>
      </div>
    </div>
  );
}