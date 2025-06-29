import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { XCircle } from 'lucide-react';

const errorMessages: Record<string, string> = {
  otp_expired: 'Your password reset or confirmation link has expired. Please request a new one.',
  invalid_otp: 'The link you used is invalid. Please request a new one.',
  access_denied: 'Access denied. Please try again or contact support.',
};

const AuthError = () => {
  const [error, setError] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1); // Remove '#'
    const params = new URLSearchParams(hash);
    const errorCode = params.get('error_code');
    const errorDescription = params.get('error_description');
    if (errorCode && errorMessages[errorCode]) {
      setError(errorMessages[errorCode]);
    } else if (errorDescription) {
      setError(errorDescription.replace(/\+/g, ' '));
    } else {
      setError('An unknown authentication error occurred.');
    }
    setDescription(params.get('error') || '');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Card className="w-full max-w-md animate-scale-in shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex flex-col items-center justify-center p-8">
        <XCircle className="w-8 h-8 text-red-600 dark:text-red-400 mb-4" />
        <div className="text-gray-900 dark:text-gray-100 font-bold text-xl mb-2">Authentication Error</div>
        <div className="text-gray-700 dark:text-gray-300 mb-4 text-center">{error}</div>
        <Button onClick={() => navigate('/forgot-password')} className="w-full bg-orange-600 hover:bg-orange-700 text-white mt-2 mb-2">
          Request New Reset Link
        </Button>
        <Button onClick={() => navigate('/auth')} variant="outline" className="w-full">
          Back to Sign In
        </Button>
      </Card>
    </div>
  );
};

export default AuthError; 