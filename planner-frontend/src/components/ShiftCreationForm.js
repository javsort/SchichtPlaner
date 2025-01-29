import styled from 'styled-components';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormLabel = styled.label`
  font-size: 14px;
  margin-bottom: 4px;
`;

const FormInput = styled.input`
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ShiftCreationForm = ({ employees }) => {
  return (
    <FormContainer>
      <FormLabel>Shift Start Time</FormLabel>
      <FormInput type="time" />
      <FormLabel>Shift End Time</FormLabel>
      <FormInput type="time" />
      <FormLabel>Employee</FormLabel>
      <select>
        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.name}
          </option>
        ))}
      </select>
    </FormContainer>
  );
};

export default ShiftCreationForm;
