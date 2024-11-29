import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from './useAuth';
import { RoleName } from '../types/api/types';

interface RouteGuardOptions {
  allowedRoles?: RoleName[];
  redirectTo?: string;
}

const useRouteGuard = (options: RouteGuardOptions = {}) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const checkAccess = () => {
    if (!isAuthenticated) {
      navigate('/auth/login', { 
        state: { from: location },
        replace: true 
      });
      return false;
    }

    if (options.allowedRoles && user) {
      const userRoles = user.userRoles.map(ur => ur.role.name);
      const hasRequiredRole = options.allowedRoles.some(role => 
        userRoles.includes(role)
      );

      if (!hasRequiredRole) {
        navigate(options.redirectTo || '/', { replace: true });
        return false;
      }
    }

    return true;
  };

  return { checkAccess };
};
export default useRouteGuard; 