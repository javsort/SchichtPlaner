// ShiftManagement.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShiftManagement from './ShiftManagement';
import moment from 'moment';

describe('ShiftManagement Component', () => {
  // For tests that need to refer to the default currentUser
  const currentUser = { id: 1, name: 'John Doe' };

  test('renders header and initial shift overview table', () => {
    render(<ShiftManagement currentUser={currentUser} />);
    
    // Check for the header
    expect(screen.getByText(/Shift Management/i)).toBeInTheDocument();
    
    // Verify that the initial shifts appear in the overview
    expect(screen.getByText(/Morning Shift/i)).toBeInTheDocument();
    expect(screen.getByText(/Evening Shift/i)).toBeInTheDocument();
  });

  test('allows creating a new shift', () => {
    render(<ShiftManagement currentUser={currentUser} />);
    
    // Since the inputs do not have explicit accessible names,
    // we use query selectors based on type and order.
    const container = document.body;
    
    // Assume the first input[type="text"] is the "Shift Name" input.
    const shiftNameInput = container.querySelector('input[type="text"]');
    // For "Start Date & Time" and "End Date & Time", query by type "datetime-local".
    const dateTimeInputs = container.querySelectorAll('input[type="datetime-local"]');
    // The roles-required and assigned-employees inputs are also text inputs; we use all textboxes.
    const textboxes = container.querySelectorAll('input[type="text"]');
    
    // Fill in the "Shift Name"
    fireEvent.change(shiftNameInput, { target: { value: 'Test Shift' } });
    
    // Fill in the "Start Date & Time" (first datetime-local input)
    fireEvent.change(dateTimeInputs[0], { target: { value: '2025-02-06T10:00' } });
    // Fill in the "End Date & Time" (second datetime-local input)
    fireEvent.change(dateTimeInputs[1], { target: { value: '2025-02-06T14:00' } });
    
    // For roles required, locate the input that comes after the "Roles Required" label.
    // In this component the order is: Shift Name, then two datetime-local inputs,
    // then a text input for roles, then one for assigned employees.
    // We assume the second textbox (index 1) in our NodeList (since index 0 was used for shift name)
    // is for roles required.
    const rolesInput = textboxes[1];
    fireEvent.change(rolesInput, { target: { value: 'Supervisor,Technician' } });
    
    // The next textbox (index 2) is for assigned employees.
    const assignedInput = textboxes[2];
    fireEvent.change(assignedInput, { target: { value: '1,2' } });
    
    // Find and click the submit button. We use getByRole on a button with text "Add Shift"
    const submitButton = screen.getByRole('button', { name: /Add Shift/i });
    fireEvent.click(submitButton);
    
    // Now check that the new shift appears in the Shift Overview table.
    // The new shift title should be "Test Shift", and its calendar event title is augmented with the assigned employees.
    expect(screen.getByText(/Test Shift/i)).toBeInTheDocument();
  });

  test('allows editing a shift', () => {
    render(<ShiftManagement currentUser={currentUser} />);
    
    // Find all "Edit" buttons; assume the first one corresponds to the "Morning Shift"
    const editButtons = screen.getAllByText(/Edit/i);
    expect(editButtons.length).toBeGreaterThan(0);
    fireEvent.click(editButtons[0]);
    
    // After clicking "Edit", the form should now be in editing mode and display "Edit Shift" as heading.
    expect(screen.getByText(/Edit Shift/i)).toBeInTheDocument();
    
    // Locate the "Shift Name" input via DOM query as before.
    const container = document.body;
    const shiftNameInput = container.querySelector('input[type="text"]');
    
    // Change the shift name to "Updated Shift"
    fireEvent.change(shiftNameInput, { target: { value: 'Updated Shift' } });
    
    // Find the "Update Shift" button and click it.
    const updateButton = screen.getByRole('button', { name: /Update Shift/i });
    fireEvent.click(updateButton);
    
    // Verify that "Updated Shift" now appears in the overview.
    expect(screen.getByText(/Updated Shift/i)).toBeInTheDocument();
  });

  test('allows deleting a shift', () => {
    // Override window.confirm so that deletion is confirmed.
    window.confirm = jest.fn(() => true);
    
    render(<ShiftManagement currentUser={currentUser} />);
    
    // Find all "Delete" buttons; assume the first one corresponds to "Morning Shift"
    const deleteButtons = screen.getAllByText(/Delete/i);
    expect(deleteButtons.length).toBeGreaterThan(0);
    fireEvent.click(deleteButtons[0]);
    
    // After deletion, "Morning Shift" should no longer appear in the document.
    expect(screen.queryByText(/Morning Shift/i)).not.toBeInTheDocument();
  });
});
