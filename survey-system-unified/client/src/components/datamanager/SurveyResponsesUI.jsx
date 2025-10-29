import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  createSurveyResponse,
  fetchSurveyResponses,
  updateSurveyResponse,
  deleteSurveyResponse,
  fetchResponsesByUserAndQuestion,
} from '../utils/crudapi';

// Styled Components (Copied from EstablishmentsUI.jsx)
const Container = styled.div`
  max-width: 90vw;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(145deg, rgb(193, 215, 255), rgb(205, 255, 113));
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 600;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  height: 40px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.3);
    outline: none;
  }
`;

const Button = styled.button`
  width: fit-content;
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
  }

  &:active {
    background-color: #2472a4;
    transform: translateY(0);
  }
`;

const TableContainer = styled.div`
  max-height: 500px;
  overflow-y: auto;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: #3498db;
  color: white;
  position: sticky;
  top: 0;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: rgba(4, 108, 177, 0.86);
  }
  &:nth-child(odd) {
    background-color: rgba(5, 124, 160, 0.59);
  }

  &:hover {
    background-color: #0099ff;
    color: white;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border: 1px solid #ddd;
  text-align: left;
  min-width: 100px;
  max-height: 150px;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-right: 0.5rem;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const EditButton = styled(ActionButton)`
  background-color: #f1c40f;
  color: white;

  &:hover {
    background-color: #f39c12;
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: #e74c3c;
  color: white;

  &:hover {
    background-color: #c0392b;
  }
`;

const Snackbar = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4caf50;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const SurveyResponsesUI = () => {
    const [responses, setResponses] = useState([]);
    const [formData, setFormData] = useState({
      anonymous_user_id: '',
      surveyquestion_ref: '',
      response_value: '',
    });
    const [editMode, setEditMode] = useState(null);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('success'); // 'success' or 'error'
    const [searchTerm, setSearchTerm] = useState(''); // New state for search term
  
    useEffect(() => {
      fetchSurveyResponses().then((data) => {
        setResponses(data);
      });
    }, []);
  
    // Filter responses based on the search term
    const filteredResponses = responses.filter((res) => {
      return (
        res.anonymous_user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.surveyquestion_ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.response_value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        if (editMode) {
          // Update response
          const updatedResponse = await updateSurveyResponse(editMode, formData.response_value);
          setResponses(responses.map((res) => (res.response_id === editMode ? updatedResponse : res)));
          setEditMode(null);
          setSnackbarMessage('Response successfully updated!');
          setSnackbarType('success');
        } else {
          // DISABLED ---- DATA INTEGRITY PURPOSES
          // const newResponse = await createSurveyResponse(
          //   formData.anonymous_user_id,
          //   formData.surveyquestion_ref,
          //   formData.response_value
          // );
          // setResponses([...responses, newResponse]);
          // setSnackbarMessage('Response successfully created!');
          // setSnackbarType('success');
        }
  
        // Reset the form
        setFormData({
          anonymous_user_id: '',
          surveyquestion_ref: '',
          response_value: '',
        });
  
        // Show snackbar
        setShowSnackbar(true);
        setTimeout(() => setShowSnackbar(false), 3000);
      } catch (error) {
        console.error('Error submitting response:', error);
        setSnackbarMessage('An unexpected error occurred. Please try again.');
        setSnackbarType('error');
        setShowSnackbar(true);
        setTimeout(() => setShowSnackbar(false), 3000);
      }
    };
  
    const handleDelete = async (anonymous_user_id) => {
      try {
        await deleteSurveyResponse(anonymous_user_id);
        setResponses(responses.filter((res) => res.anonymous_user_id !== anonymous_user_id));
        setSnackbarMessage('Response successfully deleted!');
        setSnackbarType('success');
        setShowSnackbar(true);
        setTimeout(() => setShowSnackbar(false), 3000);
      } catch (error) {
        console.error('Error deleting response:', error);
        setSnackbarMessage('An unexpected error occurred. Please try again.');
        setSnackbarType('error');
        setShowSnackbar(true);
        setTimeout(() => setShowSnackbar(false), 3000);
      }
    };
  
    const handleEdit = (response) => {
      setFormData({
        anonymous_user_id: response.anonymous_user_id,
        surveyquestion_ref: response.surveyquestion_ref,
        response_value: response.response_value,
      });
      setEditMode(response.response_id);
    };
  
    return (
      <Container>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Button
            onClick={() => fetchSurveyResponses().then((data) => setResponses(data))}
            style={{ flexShrink: 0 }}
          >
            🔄 Reload
          </Button>
          <Title style={{ margin: 0 }}>Survey Responses Management</Title>
        </div>
  
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Anonymous User ID"
            value={formData.anonymous_user_id}
            onChange={(e) => setFormData({ ...formData, anonymous_user_id: e.target.value })}
            required
          />
          <Input
            type="text"
            placeholder="Survey Question Reference"
            value={formData.surveyquestion_ref}
            onChange={(e) => setFormData({ ...formData, surveyquestion_ref: e.target.value })}
            required
          />
          <Input
            type="text"
            placeholder="Response Value"
            value={formData.response_value}
            onChange={(e) => setFormData({ ...formData, response_value: e.target.value })}
            required
          />
          <Button type="submit">{editMode ? 'Update Response' : 'Create Response'}</Button>
        </Form>
  
        {/* Add Search Input Field */}
        <Input
          type="text"
          placeholder="Search responses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '1rem', width: '100%' }}
        />
  
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <th>Anonymous User ID</th>
                <th>Survey Question Reference</th>
                <th>Response Value</th>
                <th>Actions</th>
              </tr>
            </TableHeader>
            <tbody>
              {filteredResponses.map((res) => (
                <TableRow key={res.response_id}>
                  <TableCell>{res.anonymous_user_id}</TableCell>
                  <TableCell>{res.surveyquestion_ref}</TableCell>
                  <TableCell>{res.response_value}</TableCell>
                  <TableCell>
                    <EditButton onClick={() => handleEdit(res)}>Edit</EditButton>
                    <DeleteButton onClick={() => handleDelete(res.anonymous_user_id)}>Delete</DeleteButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
  
        <Snackbar show={showSnackbar} type={snackbarType}>
          {snackbarMessage}
        </Snackbar>
      </Container>
    );
  };
  
  export default SurveyResponsesUI;