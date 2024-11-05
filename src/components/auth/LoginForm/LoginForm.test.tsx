import { render, screen, fireEvent, waitFor } from '@/utils/jest';
import { act } from 'react'; // Updated import
import LoginForm from './index';
import { useAuth } from '@/contexts/AuthContext';
import userEvent from '@testing-library/user-event';

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.Mock;

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with default values', async () => {
    mockUseAuth.mockReturnValue({ login: jest.fn() });
    render(<LoginForm />);

    const usernameInput = screen.getByLabelText(
      /username/i,
    ) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      /password/i,
    ) as HTMLInputElement;

    await userEvent.type(usernameInput, '6590001234');
    await userEvent.type(passwordInput, 'Password@12345');

    expect(usernameInput.value).toBe('6590001234');
    expect(passwordInput.value).toBe('Password@12345');
  });

  it('displays validation errors for empty fields', async () => {
    mockUseAuth.mockReturnValue({ login: jest.fn() });
    render(<LoginForm />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Clear the default values
    fireEvent.change(usernameInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: '' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('calls the login function with correct credentials', async () => {
    const mockLogin = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({ login: mockLogin });

    render(<LoginForm />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(mockLogin).toHaveBeenCalledWith('testuser', 'testpassword');
  });

  it('displays an error message when login fails', async () => {
    const mockLogin = jest.fn().mockRejectedValue(new Error('Login failed'));
    mockUseAuth.mockReturnValue({ login: mockLogin });

    render(<LoginForm />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          'Login failed. Please check your credentials and try again.',
        ),
      ).toBeInTheDocument();
    });
  });
});
