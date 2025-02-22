// ShiftCreationForm.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShiftCreationForm from './ShiftCreationForm';

describe('ShiftCreationForm', () => {
  test('renders the form fields and submit button', () => {
    render(<ShiftCreationForm />);

    // Check for the presence of the input fields and the button
    expect(screen.getByLabelText(/Shift Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date & Time:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Roles Required:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Assigned Employees:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Shift/i })).toBeInTheDocument();
  });

  test('submits the form with correct data', () => {
    // Spy on console.log so we can verify what is logged on submit
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(<ShiftCreationForm />);

    // Fill in the "Shift Name" input
    const shiftNameInput = screen.getByLabelText(/Shift Name:/i);
    fireEvent.change(shiftNameInput, { target: { value: 'Morning Shift' } });

    // Fill in the "Date & Time" input
    const dateTimeInput = screen.getByLabelText(/Date & Time:/i);
    fireEvent.change(dateTimeInput, { target: { value: '2025-02-05T08:00' } });

    // For the multiple select, simulate selecting two options.
    // Note: The native select element’s value isn’t updated by fireEvent.change directly,
    // so we pass in a fake event with a selectedOptions array.
    const rolesSelect = screen.getByLabelText(/Roles Required:/i);
    fireEvent.change(rolesSelect, {
      target: {
        // Mimic the selectedOptions property by converting it to an array of option-like objects.
        selectedOptions: [
          { value: 'Supervisor', selected: true },
          { value: 'Technician', selected: true }
        ]
      }
    });

    // Fill in the "Assigned Employees" input (the value will be split by commas)
    const assignedEmployeesInput = screen.getByLabelText(/Assigned Employees:/i);
    fireEvent.change(assignedEmployeesInput, { target: { value: '1,2' } });

    // Submit the form by clicking the "Create Shift" button
    const submitButton = screen.getByRole('button', { name: /Create Shift/i });
    fireEvent.click(submitButton);

    // Check that console.log was called with the correct object.
    // (Your component calls console.log({ shiftName, dateTime, roles, assignedEmployees }))
    expect(consoleSpy).toHaveBeenCalledWith({
      shiftName: 'Morning Shift',
      dateTime: '2025-02-05T08:00',
      roles: ['Supervisor', 'Technician'],
      assignedEmployees: ['1', '2']
    });

    consoleSpy.mockRestore();
  });
});
