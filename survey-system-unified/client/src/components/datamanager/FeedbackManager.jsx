import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {
  Feedback as FeedbackIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
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

// Axios instance with base URL and credentials
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_HOST}/api/admin/survey-feedback`,
  withCredentials: true,
});

// Component specific styled components
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const CollapsibleContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.1);
  margin-bottom: 24px;
`;

const CollapsibleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 12px 0;
  
  h3 {
    margin: 0;
    color: #4a5568;
    font-size: 18px;
    font-weight: 600;
  }
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

// Helper function to truncate text
const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// Helper function to get sentiment value
const getSentiment = (feedback) => {
  return feedback.sentiment || 'N/A';
};

const SurveyFeedbackCRUD = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    entity: '',
    rating: '',
    response_value: '',
    touchpoint: '', // Will be disabled in form
    anonymous_user_id: '', // Will be disabled in form
    surveyquestion_ref: '', // Will be disabled in form
    language: 'en',
    relevance: 'UNKNOWN',
  });  
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({
    anonymous_user_id: '',
    entity: '',
    touchpoint: '',
    is_analyzed: '',
  });
  
  const [isFormVisible, setIsFormVisible] = useState(false); // State to toggle form visibility

  // Fetch feedback data
  const fetchFeedbacks = async () => {
    setLoading(true);
    setError(null);
    try {
      // Convert empty strings to undefined for the API
      const apiFilters = Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [key, value || undefined])
      );
      
      const response = await api.get('/', { params: apiFilters });
      setFeedbacks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [filters]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      entity: '',
      rating: '',
      response_value: '',
      touchpoint: '',
      anonymous_user_id: '',
      surveyquestion_ref: '',
      language: 'en',
      relevance: 'UNKNOWN',
    });
    setEditingId(null);
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingId) {
        // Update existing feedback
        const response = await api.put(`/${editingId}`, formData);
        setFeedbacks(prev =>
          prev.map(item => (item.response_id === editingId ? response.data : item)));
      } else {
        // Create new feedback
        const response = await api.post('/', formData);
        setFeedbacks(prev => [...prev, response.data]);
      }
      resetForm();
      fetchFeedbacks(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit feedback
  const handleEdit = (feedback) => {
    setFormData({
      entity: feedback.entity,
      rating: feedback.rating,
      response_value: feedback.response_value,
      touchpoint: feedback.touchpoint, // This will be displayed but not editable
      anonymous_user_id: feedback.anonymous_user_id, // This will be displayed but not editable
      surveyquestion_ref: feedback.surveyquestion_ref, // This will be displayed but not editable
      language: feedback.language,
      relevance: feedback.relevance,
    });
    setEditingId(feedback.response_id);
  };
    // Delete feedback
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      setLoading(true);
      setError(null);
      try {
        await api.delete(`/${id}`);
        setFeedbacks(prev => prev.filter(item => item.response_id !== id));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ModernContainer>
      <SectionHeader>
        <h2>
          <FeedbackIcon />
          Survey Feedback Management
        </h2>
        <p>Manage and analyze survey feedback from users</p>
      </SectionHeader>

      <StatsGrid>
        <StatsCard>
          <h4>{feedbacks.length}</h4>
          <p>Total Feedback</p>
        </StatsCard>
        <StatsCard>
          <h4>{feedbacks.filter(f => f.is_analyzed).length}</h4>
          <p>Analyzed</p>
        </StatsCard>
        <StatsCard>
          <h4>{feedbacks.filter(f => !f.is_analyzed).length}</h4>
          <p>Not Analyzed</p>
        </StatsCard>
        <StatsCard>
          <h4>{new Set(feedbacks.map(f => f.entity)).size}</h4>
          <p>Unique Entities</p>
        </StatsCard>
      </StatsGrid>

      {error && (
        <Snackbar show={true} type="error">
          {error}
        </Snackbar>
      )}

      <CollapsibleContainer>
        <CollapsibleHeader>
          <h3>Filter Options</h3>
        </CollapsibleHeader>
        
        <ModernForm style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <InputGroup>
            <Label>User ID</Label>
            <ModernInput
              type="text"
              name="anonymous_user_id"
              value={filters.anonymous_user_id}
              onChange={handleFilterChange}
              placeholder="Filter by user ID"
            />
          </InputGroup>

          <InputGroup>
            <Label>Entity</Label>
            <ModernInput
              type="text"
              name="entity"
              value={filters.entity}
              onChange={handleFilterChange}
              placeholder="Filter by entity"
            />
          </InputGroup>

          <InputGroup>
            <Label>Touchpoint</Label>
            <ModernInput
              type="text"
              name="touchpoint"
              value={filters.touchpoint}
              onChange={handleFilterChange}
              placeholder="Filter by touchpoint"
            />
          </InputGroup>

          <InputGroup>
            <Label>Analyzed Status</Label>
            <ModernSelect
              name="is_analyzed"
              value={filters.is_analyzed}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="true">Analyzed</option>
              <option value="false">Not Analyzed</option>
            </ModernSelect>
          </InputGroup>
        </ModernForm>
      </CollapsibleContainer>

      {/* Edit Form Section */}
      {editingId && (
        <CollapsibleContainer>
          <CollapsibleHeader>
            <h3>Edit Feedback</h3>
          </CollapsibleHeader>
          
          <ModernForm onSubmit={handleSubmit}>
            <InputGroup>
              <Label>Entity</Label>
              <ModernInput
                type="text"
                name="entity"
                value={formData.entity}
                onChange={handleInputChange}
                disabled
              />
            </InputGroup>

            <InputGroup>
              <Label>Rating</Label>
              <ModernInput
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                min="1"
                max="5"
                required
              />
            </InputGroup>

            <InputGroup>
              <Label>Response Value</Label>
              <ModernInput
                as="textarea"
                name="response_value"
                value={formData.response_value}
                onChange={handleInputChange}
                required
                style={{ minHeight: '100px', resize: 'vertical' }}
              />
            </InputGroup>

            <InputGroup>
              <Label>Touchpoint</Label>
              <ModernInput
                type="text"
                name="touchpoint"
                value={formData.touchpoint}
                onChange={handleInputChange}
                disabled 
              />
            </InputGroup>

            <InputGroup>
              <Label>Anonymous User ID</Label>
              <ModernInput
                type="text"
                name="anonymous_user_id"
                value={formData.anonymous_user_id}
                onChange={handleInputChange}
                disabled 
              />
            </InputGroup>

            <InputGroup>
              <Label>Survey Question Reference</Label>
              <ModernInput
                type="text"
                name="surveyquestion_ref"
                value={formData.surveyquestion_ref}
                onChange={handleInputChange}
                disabled 
              />
            </InputGroup>

            <InputGroup>
              <Label>Language</Label>
              <ModernSelect
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                required
              >
                <option value="en">English</option>
                <option value="ko">Korean</option>
                <option value="zh">Chinese (simplified)</option>
                <option value="ja">Japanese</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="ru">Russian</option>
                <option value="hi">Hindi</option>
              </ModernSelect>
            </InputGroup>

            <InputGroup>
              <Label>Relevance</Label>
              <ModernSelect
                name="relevance"
                value={formData.relevance}
                onChange={handleInputChange}
                required
              >
                <option value="UNKNOWN">UNKNOWN</option>
                <option value="RELEVANT">RELEVANT</option>
                <option value="IRRELEVANT">IRRELEVANT</option>
              </ModernSelect>
            </InputGroup>

            <ModernButton type="submit" variant="primary" disabled={loading}>
              <EditIcon />
              Update Feedback
            </ModernButton>

            <ModernButton type="button" variant="secondary" onClick={resetForm} disabled={loading}>
              Cancel
            </ModernButton>
          </ModernForm>
        </CollapsibleContainer>
      )}

      <TableSection>
        <TableHeader>
          <h3>Survey Feedback List ({feedbacks.length})</h3>
        </TableHeader>
        <TableContainer>
          {loading && !feedbacks.length ? (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <LoadingSpinner />
              <p style={{ marginTop: '16px', color: '#718096' }}>Loading feedback data...</p>
            </div>
          ) : (
            <ModernTable>
              <ModernTableHead>
                <tr>
                  <th>ID</th>
                  <th>Entity</th>
                  <th>Rating</th>
                  <th>Feedback</th>
                  <th>Sentiment</th>
                  <th>Relevance</th>
                  <th>Touchpoint</th>
                  <th>User ID</th>
                  <th>Language</th>
                  <th>Analyzed</th>
                  <th>Actions</th>
                </tr>
              </ModernTableHead>
              <tbody>
                {feedbacks.length > 0 ? (
                  feedbacks.map(feedback => (
                    <ModernTableRow key={feedback.response_id}>
                      <ModernTableCell>{feedback.response_id}</ModernTableCell>
                      <ModernTableCell>{feedback.entity}</ModernTableCell>
                      <ModernTableCell>{feedback.rating}</ModernTableCell>
                      <ModernTableCell title={feedback.response_value}>
                        {truncateText(feedback.response_value)}
                      </ModernTableCell>
                      <ModernTableCell>{getSentiment(feedback)}</ModernTableCell>
                      <ModernTableCell>{feedback.relevance}</ModernTableCell>
                      <ModernTableCell>{feedback.touchpoint}</ModernTableCell>
                      <ModernTableCell>{feedback.anonymous_user_id}</ModernTableCell>
                      <ModernTableCell>{feedback.language}</ModernTableCell>
                      <ModernTableCell>
                        <span style={{ 
                          color: feedback.is_analyzed ? '#48bb78' : '#f56565',
                          fontWeight: '500'
                        }}>
                          {feedback.is_analyzed ? 'Yes' : 'No'}
                        </span>
                      </ModernTableCell>
                      <ModernTableCell>
                        <ActionButtonGroup>
                          <ActionButton variant="edit" onClick={() => handleEdit(feedback)}>
                            <EditIcon />
                            Edit
                          </ActionButton>
                          <ActionButton variant="delete" onClick={() => handleDelete(feedback.response_id)}>
                            <DeleteIcon />
                            Delete
                          </ActionButton>
                        </ActionButtonGroup>
                      </ModernTableCell>
                    </ModernTableRow>
                  ))
                ) : (
                  <tr>
                    <ModernTableCell colSpan="11">
                      <EmptyState>
                        <div className="icon">
                          <FeedbackIcon />
                        </div>
                        <h4>No feedback entries found</h4>
                        <p>No feedback matches your current filters.</p>
                      </EmptyState>
                    </ModernTableCell>
                  </tr>
                )}
              </tbody>
            </ModernTable>
          )}
        </TableContainer>
      </TableSection>
    </ModernContainer>
  );
};

export default SurveyFeedbackCRUD;