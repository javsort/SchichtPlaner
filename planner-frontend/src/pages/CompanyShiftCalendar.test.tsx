// src/pages/CompanyShiftCalendar.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides custom matchers like toBeInTheDocument
import CompanyShiftCalendar from './CompanyShiftCalendar';

describe('CompanyShiftCalendar', () => {
  const currentUser = { id: 1, name: "John Doe" };

  test('renders the header', () => {
    render(<CompanyShiftCalendar currentUser={currentUser} />);
    // Check that the header exists
    expect(screen.getByRole('heading', { name: /Company Shift Calendar/i })).toBeInTheDocument();
  });

  test('renders all three filter buttons', () => {
    render(<CompanyShiftCalendar currentUser={currentUser} />);
    expect(screen.getByRole('button', { name: /My Shifts/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /All Shifts/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Unoccupied Shifts/i })).toBeInTheDocument();
  });

  test('switches the active filter when clicking a button', () => {
    render(<CompanyShiftCalendar currentUser={currentUser} />);
    const myShiftsBtn = screen.getByRole('button', { name: /My Shifts/i });
    const allShiftsBtn = screen.getByRole('button', { name: /All Shifts/i });
    const unoccupiedBtn = screen.getByRole('button', { name: /Unoccupied Shifts/i });

    // Initially, the component sets calendarFilter to "all", so "All Shifts" should have the active class.
    expect(allShiftsBtn).toHaveClass('active');
    expect(myShiftsBtn).not.toHaveClass('active');
    expect(unoccupiedBtn).not.toHaveClass('active');

    // When clicking on "My Shifts", the active class should move to that button.
    fireEvent.click(myShiftsBtn);
    expect(myShiftsBtn).toHaveClass('active');
    expect(allShiftsBtn).not.toHaveClass('active');
    expect(unoccupiedBtn).not.toHaveClass('active');

    // Clicking "Unoccupied Shifts" should update the active filter accordingly.
    fireEvent.click(unoccupiedBtn);
    expect(unoccupiedBtn).toHaveClass('active');
    expect(myShiftsBtn).not.toHaveClass('active');
    expect(allShiftsBtn).not.toHaveClass('active');
  });
});
