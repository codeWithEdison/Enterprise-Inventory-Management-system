import  { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!token) {
          setStatus('error');
          return;
        }

        // Call your email verification API here
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
        setStatus('success');
        
        // Redirect to login after success
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
        console.log(error);
        
      }
    };

    verifyEmail();
  }, [token, navigate]);

  if (status === 'verifying') {
    return (
      <div className="text-center">
        <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying your email</h2>
        <p className="text-gray-600">Please wait a moment...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification failed</h2>
        <p className="text-gray-600 mb-6">
          This verification link is invalid or has expired.
        </p>
        <button
          onClick={() => navigate('/auth/login')}
          className="text-primary-600 hover:text-primary-500 font-medium"
        >
          Return to login
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Email verified successfully</h2>
      <p className="text-gray-600">
        Your email has been verified. Redirecting to login...
      </p>
    </div>
  );
};

export default VerifyEmailPage;