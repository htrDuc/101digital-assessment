import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import AppRoutes from '@/routes/AppRoutes';
import { Toaster } from '@/components/ui/toast';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <>
      <Router>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ThemeProvider>
      </Router>
      <Toaster />
    </>
  );
}
