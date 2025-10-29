import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  createLocalization,
  fetchLocalizations,
  updateLocalization,
  deleteLocalization,
} from '../utils/crudapi';

// Styled Components
const Container = styled.div`
  max-width: 90vw;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(145deg,rgb(193, 215, 255),rgb(205, 255, 113));
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

const CollapseButton = styled(Button)`
  width: 100%;
  margin-bottom: 1.5rem;
  background-color: #95a5a6;

  &:hover {
    background-color: #7f8c8d;
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
    background-color:rgba(4, 108, 177, 0.86);
  }
  &:nth-child(odd) {
    background-color:rgba(5, 124, 160, 0.59);
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

const SearchInput = styled(Input)`
  width: 100%;
  margin-bottom: 1.5rem;
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

const LocalizationUI = () => {
  const [localizations, setLocalizations] = useState([]);
  const [formData, setFormData] = useState({ key: '', language_code: '', textcontent: '', component: '' });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    fetchLocalizations().then((data) => setLocalizations(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { key, language_code, textcontent, component } = formData;

      if (editMode) {
        // Update localization
        const updatedLocalization = await updateLocalization(editMode, key, language_code, textcontent, component);
        setLocalizations(localizations.map((loc) => (loc.id === editMode ? updatedLocalization : loc)));
        setEditMode(null);
      } else {
        // Create new localization
        // const { key, language_code: language_code, textcontent, component } = formData;
        const newLocalization = await createLocalization(key, language_code, textcontent, component);
        setLocalizations([...localizations, newLocalization]);
      }

      // Reset the form
      setFormData({ key: '', language_code: '', textcontent: '', component: '' });

      // Show snackbar
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 3000);
    } catch (error) {
      console.error('Error submitting localization:', error);
    }
  };

  const handleDelete = async (id) => {
    await deleteLocalization(id);
    setLocalizations(localizations.filter((loc) => loc.id !== id));
  };

  const handleEdit = (localization) => {
    setFormData(localization);
    setEditMode(localization.id);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const filteredLocalizations = localizations.filter((loc) =>
    Object.values(loc).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Container>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <Button
          onClick={() => fetchLocalizations().then(data => setLocalizations(data))}
          style={{ flexShrink: 0 }}
        >
          🔄 Reload
        </Button>
        <Title style={{ margin: 0 }}>Localizations Management (Translations) </Title>
      </div>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Key"
          value={formData.key}
          onChange={(e) => setFormData({ ...formData, key: e.target.value })}
          required
        />
        <Input
          type="text"
          placeholder="Language Code"
          value={formData.language_code}
          onChange={(e) => setFormData({ ...formData, language_code: e.target.value })}
          required
        />
        <Input
          type="text"
          placeholder="Text Content"
          value={formData.textcontent}
          onChange={(e) => setFormData({ ...formData, textcontent: e.target.value })}
          required
        />
        <Input
          type="text"
          placeholder="Component"
          value={formData.component}
          onChange={(e) => setFormData({ ...formData, component: e.target.value })}
          required
        />
        <Button type="submit">{editMode ? 'Update Localization' : 'Create Localization'}</Button>
      </Form>

      <CollapseButton onClick={toggleCollapse}>
        {isCollapsed ? 'Show Localizations' : 'Hide Localizations'}
      </CollapseButton>

      {!isCollapsed && (
        <>
          <SearchInput
            type="text"
            placeholder="Search localizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <TableContainer>
            <Table>
              <TableHeader>
                <tr>
                  <th>Key</th>
                  <th>Language Code</th>
                  <th>Text Content</th>
                  <th>Component</th>
                  <th>Actions</th>
                </tr>
              </TableHeader>
              <tbody>
                {filteredLocalizations.map((loc) => (
                  <TableRow key={loc.id}>
                    <TableCell>{loc.key}</TableCell>
                    <TableCell>{loc.language_code}</TableCell>
                    <TableCell>{loc.textcontent}</TableCell>
                    <TableCell>{loc.component}</TableCell>
                    <TableCell>
                      <EditButton onClick={() => handleEdit(loc)}>Edit</EditButton>
                      <DeleteButton onClick={() => handleDelete(loc.id)}>Delete</DeleteButton>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </>
      )}
      <Snackbar show={showSnackbar}>Localization successfully inserted!</Snackbar>
    </Container>
  );
};

export default LocalizationUI;
