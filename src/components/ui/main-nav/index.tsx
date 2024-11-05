import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      <div className="relative z-20 flex items-center text-lg font-medium">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-6 w-6"
        >
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
        Simple Invoice
      </div>
      <Link
        to="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Invoice
      </Link>
    </nav>
  );
}
