// AdminDashboard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminDashboard from './AdminDashboard';
import { MemoryRouter } from 'react-router-dom';

// Create a mock for the useNavigate hook
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('AdminDashboard Component', () => {
  // Reset the mocked navigation function before each test
  beforeEach(() => {
    mockedUsedNavigate.mockReset();
  });

  test('renders header and sidebar buttons', () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Check that the header and sidebar title are rendered
    expect(screen.getByText(/Administrator Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Admin Panel/i)).toBeInTheDocument();

    // Verify that each sidebar button is rendered
    expect(
      screen.getByRole('button', { name: /Employee Management/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Shift Management/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Company Shift Calendar/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Shift Approval/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Shift Availability/i })
    ).toBeInTheDocument();
  });

  test('navigates correctly when sidebar buttons are clicked', () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Click each sidebar button and verify the corresponding navigation route is passed
    fireEvent.click(screen.getByRole('button', { name: /Employee Management/i }));
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/employee-management');

    fireEvent.click(screen.getByRole('button', { name: /Shift Management/i }));
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/shift-management');

    fireEvent.click(screen.getByRole('button', { name: /Company Shift Calendar/i }));
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/shift-view');

    fireEvent.click(screen.getByRole('button', { name: /Shift Approval/i }));
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/shift-approval');

    fireEvent.click(screen.getByRole('button', { name: /Shift Availability/i }));
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/shift-availability');
  });

  test('navigates when clicking an overview card', () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // In the overview section, click on the card that displays "Employee Management"
    const overviewCard = screen.getByText(/Employee Management/i);
    fireEvent.click(overviewCard);
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/employee-management');
  });
});
