import { render, screen } from '@/utils/jest';
import AuthenticationPage from './index';

// Mock the LoginForm component
jest.mock('@/components/auth/LoginForm', () => {
  return function MockLoginForm() {
    return <div data-testid="mock-login-form">Mock Login Form</div>;
  };
});

describe('AuthenticationPage', () => {
  it('renders the login form', () => {
    render(<AuthenticationPage />);
    expect(screen.getByTestId('mock-login-form')).toBeInTheDocument();
  });

  it('displays the correct title', () => {
    render(<AuthenticationPage />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('displays the terms and privacy policy text', () => {
    render(<AuthenticationPage />);
    expect(
      screen.getByText(/By clicking continue, you agree to our/),
    ).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });

  it('displays the app name', () => {
    render(<AuthenticationPage />);
    expect(screen.getByText('Simple Invoice')).toBeInTheDocument();
  });
});
