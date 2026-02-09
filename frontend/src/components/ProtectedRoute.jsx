import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children, requireRole }) => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return <Loader fullScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requireRole && user?.role !== requireRole) {
        return <Navigate to="/jobs" replace />;
    }

    return children;
};

export default ProtectedRoute;
