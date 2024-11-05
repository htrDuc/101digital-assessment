import { fetchAppAccessToken, getUserProfile } from '@/services';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  accessToken: string | null;
  orgToken: string | null;
  me: any | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [orgToken, setOrgToken] = useState<string | null>(null);
  const [me, setMe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedOrgToken = localStorage.getItem('orgToken');
    if (storedAccessToken && storedOrgToken) {
      setAccessToken(storedAccessToken);
      setOrgToken(storedOrgToken);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const login = async (username: string, password: string) => {
    try {
      const tokenData = await fetchAppAccessToken(username, password);
      setAccessToken(tokenData.access_token);
      localStorage.setItem('accessToken', tokenData.access_token);

      const userProfile = await getUserProfile();
      setMe(userProfile.data);
      const membershipOrgToken = userProfile.data.memberships[0].token;
      setOrgToken(membershipOrgToken);
      localStorage.setItem('orgToken', membershipOrgToken);

      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setOrgToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('orgToken');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ accessToken, orgToken, me, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
