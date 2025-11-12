import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Assignment as AssignmentIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Quiz as QuizIcon,
} from '@mui/icons-material';
import {
  createSurveyResponse,
  fetchSurveyResponses,
  updateSurveyResponse,
  deleteSurveyResponse,
  fetchResponsesByUserAndQuestion,
} from '../utils/crudapi';
import {
  ModernContainer,
  SectionHeader,
  ModernForm,
  InputGroup,
  Label,
  ModernInput,
  ModernSelect,
  ModernButton,
  TableSection,
  TableHeader,
  TableContainer,
  ModernTable,
  ModernTableHead,
  ModernTableRow,
  ModernTableCell,
  ActionButtonGroup,
  ActionButton,
  LoadingSpinner,
  EmptyState,
  StatsCard,
} from './styles/SharedStyles';

// Component specific styled components
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const Snackbar = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(72, 187, 120, 0.3);
  opacity: ${(props) => (props.show ? 1 : 0)};
  transform: translateY(${(props) => (props.show ? '0' : '20px')});
  transition: all 0.3s ease;
  z-index: 1000;
  font-family: 'Poppins';
  font-weight: 500;
  
  ${props => props.type === 'error' && `
    background: linear-gradient(135deg, #fc8181 0%, #f56565 100%);
    box-shadow: 0 8px 25px rgba(245, 101, 101, 0.3);
  `}
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
      <ModernContainer>
        <SectionHeader>
          <h2>
            <QuizIcon />
            Survey Responses Management
          </h2>
          <p>Manage survey responses and analyze user feedback data</p>
        </SectionHeader>

        <StatsGrid>
          <StatsCard>
            <h4>{responses.length}</h4>
            <p>Total Responses</p>
          </StatsCard>
          <StatsCard>
            <h4>{filteredResponses.length}</h4>
            <p>Filtered Results</p>
          </StatsCard>
          <StatsCard>
            <h4>{new Set(responses.map(res => res.anonymous_user_id)).size}</h4>
            <p>Unique Users</p>
          </StatsCard>
          <StatsCard>
            <h4>{new Set(responses.map(res => res.surveyquestion_ref)).size}</h4>
            <p>Question Types</p>
          </StatsCard>
        </StatsGrid>

        <ModernForm onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Anonymous User ID</Label>
            <ModernInput
              type="text"
              placeholder="Enter anonymous user ID"
              value={formData.anonymous_user_id}
              onChange={(e) => setFormData({ ...formData, anonymous_user_id: e.target.value })}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Survey Question Reference</Label>
            <ModernInput
              type="text"
              placeholder="Enter survey question reference"
              value={formData.surveyquestion_ref}
              onChange={(e) => setFormData({ ...formData, surveyquestion_ref: e.target.value })}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Response Value</Label>
            <ModernInput
              type="text"
              placeholder="Enter response value"
              value={formData.response_value}
              onChange={(e) => setFormData({ ...formData, response_value: e.target.value })}
              required
            />
          </InputGroup>

          <ModernButton type="submit" variant="primary">
            <AddIcon />
            {editMode ? 'Update Response' : 'Create Response'}
          </ModernButton>

          <ModernButton 
            type="button" 
            variant="secondary"
            onClick={() => fetchSurveyResponses().then((data) => setResponses(data))}
          >
            🔄 Reload Data
          </ModernButton>
        </ModernForm>

        <InputGroup style={{ marginBottom: '16px' }}>
          <Label>Search Responses</Label>
          <ModernInput
            type="text"
            placeholder="Search by user ID, question reference, or response value..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <TableSection>
          <TableHeader>
            <h3>Survey Responses ({filteredResponses.length})</h3>
          </TableHeader>
          <TableContainer>
            <ModernTable>
              <ModernTableHead>
                <tr>
                  <th>Anonymous User ID</th>
                  <th>Survey Question Reference</th>
                  <th>Response Value</th>
                  <th>Actions</th>
                </tr>
              </ModernTableHead>
              <tbody>
                {filteredResponses.length > 0 ? (
                  filteredResponses.map((res) => (
                    <ModernTableRow key={res.response_id}>
                      <ModernTableCell>{res.anonymous_user_id}</ModernTableCell>
                      <ModernTableCell>{res.surveyquestion_ref}</ModernTableCell>
                      <ModernTableCell>{res.response_value}</ModernTableCell>
                      <ModernTableCell>
                        <ActionButtonGroup>
                          <ActionButton variant="edit" onClick={() => handleEdit(res)}>
                            <EditIcon />
                            Edit
                          </ActionButton>
                          <ActionButton variant="delete" onClick={() => handleDelete(res.anonymous_user_id)}>
                            <DeleteIcon />
                            Delete
                          </ActionButton>
                        </ActionButtonGroup>
                      </ModernTableCell>
                    </ModernTableRow>
                  ))
                ) : (
                  <tr>
                    <ModernTableCell colSpan="4">
                      <EmptyState>
                        <div className="icon">
                          <AssignmentIcon />
                        </div>
                        <h4>No survey responses found</h4>
                        <p>Try adjusting your search criteria or add a new response.</p>
                      </EmptyState>
                    </ModernTableCell>
                  </tr>
                )}
              </tbody>
            </ModernTable>
          </TableContainer>
        </TableSection>

        <Snackbar show={showSnackbar} type={snackbarType}>
          {snackbarMessage}
        </Snackbar>
      </ModernContainer>
    );
  };
  
  export default SurveyResponsesUI;