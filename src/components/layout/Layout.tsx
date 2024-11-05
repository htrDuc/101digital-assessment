import { MainNav } from '@/components/ui/main-nav';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { UserNav } from '@/components/ui/user-nav';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <div className="flex-col flex">
        <div className="border-b">
          <div className="flex h-16 items-center md:px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <ModeToggle />
              <UserNav />
            </div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 space-y-4 p-8 pt-6"
        >
          <Outlet />
        </motion.div>
      </div>
    </>
  );
}
