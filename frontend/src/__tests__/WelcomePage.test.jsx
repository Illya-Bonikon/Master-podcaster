import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WelcomePage from '../components/WelcomePage';

const renderWithRouter = (component) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('WelcomePage Component', () => {
  test('renders welcome message', () => {
    renderWithRouter(<WelcomePage />);
    const welcomeMessage = screen.getByText(/Master Podcaster/i);
    expect(welcomeMessage).toBeInTheDocument();
  });

  test('renders login and register buttons', () => {
    renderWithRouter(<WelcomePage />);
    const loginButton = screen.getByText(/Увійти/i);
    const registerButton = screen.getByText(/Реєстрація/i);
    
    expect(loginButton).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();
  });

  test('login button links to login page', () => {
    renderWithRouter(<WelcomePage />);
    const loginButton = screen.getByText(/Увійти/i);
    expect(loginButton.closest('a')).toHaveAttribute('href', '/login');
  });

  test('register button links to register page', () => {
    renderWithRouter(<WelcomePage />);
    const registerButton = screen.getByText(/Реєстрація/i);
    expect(registerButton.closest('a')).toHaveAttribute('href', '/register');
  });
}); 