import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { color } from 'framer-motion';

// Axios instance with base URL and credentials
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_HOST}/api/admin/survey-feedback`,
  withCredentials: true,
});

// Styled components
const Container = styled.div`
  max-width: 2000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  overflow-x: auto;  
  background-color: rgb(168, 216, 240); // Light background for better contrast
  height: 100vh; // Ensures full viewport height
`;

const Header = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const Th = styled.th`
  background-color: #3498db;
  color: white;
  padding: 12px;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: rgb(96, 165, 255);
  }
  &:nth-child(odd) {
    background-color: rgb(66, 107, 160);
  }
  &:hover {
    background-color: rgb(69, 85, 92);
  }
`;

const Button = styled.button`
  padding: 8px 12px;
  margin: 0 5px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    opacity: 0.9;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #3498db;
  color: white;
`;

const DangerButton = styled(Button)`
  background-color: #e74c3c;
  color: white;
`;

const SuccessButton = styled(Button)`
  background-color: #2ecc71;
  color: white;
`;

const CollapsibleContainer = styled.div`
  background-color: rgba(113, 173, 197, 0.78);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
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
    <Container>
      <Header>Survey Feedback Management</Header>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
      {/* Filter Section */}
      <FilterContainer>
        <FilterGroup>
          <Label>User ID</Label>
          <Input
            type="text"
            name="anonymous_user_id"
            value={filters.anonymous_user_id}
            onChange={handleFilterChange}
            placeholder="Filter by user ID"
          />
        </FilterGroup>

        <FilterGroup>
          <Label>Entity</Label>
          <Input
            type="text"
            name="entity"
            value={filters.entity}
            onChange={handleFilterChange}
            placeholder="Filter by entity"
          />
        </FilterGroup>

        <FilterGroup>
          <Label>Touchpoint</Label>
          <Input
            type="text"
            name="touchpoint"
            value={filters.touchpoint}
            onChange={handleFilterChange}
            placeholder="Filter by touchpoint"
          />
        </FilterGroup>

        <FilterGroup>
          <Label>Analyzed Status</Label>
          <Select
            name="is_analyzed"
            value={filters.is_analyzed}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="true">Analyzed</option>
            <option value="false">Not Analyzed</option>
          </Select>
        </FilterGroup>
      </FilterContainer>

      {/* Collapsible Form Section */}
      {editingId && (
        <CollapsibleContainer>
          <h2>Edit Feedback</h2>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Entity</Label>
              <Input
                type="text"
                name="entity"
                value={formData.entity}
                onChange={handleInputChange}
                disabled
              />
            </FormGroup>

            <FormGroup>
              <Label>Rating</Label>
              <Input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                min="1"
                max="5"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Response Value</Label>
              <TextArea
                name="response_value"
                value={formData.response_value}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Touchpoint</Label>
              <Input
                type="text"
                name="touchpoint"
                value={formData.touchpoint}
                onChange={handleInputChange}
                disabled 
              />
            </FormGroup>

            <FormGroup>
              <Label>Anonymous User ID</Label>
              <Input
                type="text"
                name="anonymous_user_id"
                value={formData.anonymous_user_id}
                onChange={handleInputChange}
                disabled 
              />
            </FormGroup>

            <FormGroup>
              <Label>Survey Question Reference</Label>
              <Input
                type="text"
                name="surveyquestion_ref"
                value={formData.surveyquestion_ref}
                onChange={handleInputChange}
                disabled 
              />
            </FormGroup>

            <FormGroup>
              <Label>Language</Label>
              <Select
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
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Relevance</Label>
              <Select
                name="relevance"
                value={formData.relevance}
                onChange={handleInputChange}
                required
              >
                <option value="UNKNOWN">UNKNOWN</option>
                <option value="RELEVANT">RELEVANT</option>
                <option value="IRRELEVANT">IRRELEVANT</option>
              </Select>
            </FormGroup>

            <div style={{ marginTop: '20px' }}>
              <Button type="submit" disabled={loading}>
                Update
              </Button>
              <Button type="button" onClick={resetForm} disabled={loading}>
                Cancel
              </Button>
            </div>
          </form>
        </CollapsibleContainer>
      )}

      {/* List Section */}
      <h2 style={{color: 'black'}}>Feedback List</h2>
      {loading && !feedbacks.length ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <thead>
            <Tr>
              <Th>ID</Th>
              <Th>Entity</Th>
              <Th>Rating</Th>
              <Th>Feedback</Th>
              <Th>Sentiment</Th>
              <Th>Relevance</Th>
              <Th>Touchpoint</Th>
              <Th>User ID</Th>
              <Th>Language</Th>
              <Th>Analyzed</Th>
              <Th>Actions</Th>
            </Tr>
          </thead>
          <tbody>
            {feedbacks.map(feedback => (
              <Tr key={feedback.response_id}>
                <Td>{feedback.response_id}</Td>
                <Td>{feedback.entity}</Td>
                <Td>{feedback.rating}</Td>
                <Td>{truncateText(feedback.response_value)}</Td>
                <Td>{getSentiment(feedback)}</Td>
                <Td>{feedback.relevance}</Td>
                <Td>{feedback.touchpoint}</Td>
                <Td>{feedback.anonymous_user_id}</Td>
                <Td>{feedback.language}</Td>
                <Td>{feedback.is_analyzed ? 'Yes' : 'No'}</Td>
                <Td>
                  <PrimaryButton onClick={() => handleEdit(feedback)}>
                    Edit
                  </PrimaryButton>
                  <DangerButton onClick={() => handleDelete(feedback.response_id)}>
                    Delete
                  </DangerButton>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      {!loading && !feedbacks.length && <div>No feedback entries found.</div>}
    </Container>
  );
};

export default SurveyFeedbackCRUD;