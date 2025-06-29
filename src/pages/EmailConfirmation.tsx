import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const EmailConfirmation = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1); // Remove '#'
    const params = new URLSearchParams(hash);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    const type = params.get('type');

    if (type === 'signup' && access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token })
        .then(({ error }) => {
          if (error) {
            setStatus('error');
            setMessage('Invalid or expired confirmation link.');
            toast({
              title: 'Confirmation failed',
              description: error.message,
              variant: 'destructive',
            });
          } else {
            setStatus('success');
            setMessage('Your email has been confirmed successfully! You can now sign in to your account.');
            toast({
              title: 'Email confirmed!',
              description: 'Your account has been activated successfully.',
            });
          }
        });
    } else {
      setStatus('error');
      setMessage('Invalid confirmation link. Please try signing up again.');
    }
  }, [toast]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Card className="w-full max-w-md animate-scale-in shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex flex-col items-center justify-center p-8">
          <Loader2 className="w-8 h-8 text-orange-600 dark:text-orange-400 animate-spin mb-4" />
          <div className="text-gray-700 dark:text-gray-300">Confirming your email...</div>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Card className="w-full max-w-md animate-scale-in shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex flex-col items-center justify-center p-8">
          <XCircle className="w-8 h-8 text-red-600 dark:text-red-400 mb-4" />
          <div className="text-gray-700 dark:text-gray-300 mb-2">{message}</div>
          <Button onClick={() => navigate('/auth')} className="w-full bg-orange-600 hover:bg-orange-700 text-white mt-2">Back to Sign In</Button>
        </Card>
      </div>
    );
  }

  // Success
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Card className="w-full max-w-md animate-scale-in shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex flex-col items-center justify-center p-8">
        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mb-4" />
        <div className="text-gray-900 dark:text-gray-100 font-bold text-xl mb-2">Email Confirmed!</div>
        <div className="text-gray-700 dark:text-gray-300 mb-4 text-center">{message}</div>
        <Button onClick={() => navigate('/auth')} className="w-full bg-orange-600 hover:bg-orange-700 text-white mt-2">Sign In</Button>
      </Card>
    </div>
  );
};

export default EmailConfirmation; 