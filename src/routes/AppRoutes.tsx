import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Layout from '@/components/layout/Layout';
import Invoice from '@/pages/Invoice';
import Login from '@/pages/Login';
import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';

export default function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Invoice />} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
