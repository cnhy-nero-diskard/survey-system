import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Language as LanguageIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import {
  createLocalization,
  fetchLocalizations,
  updateLocalization,
  deleteLocalization,
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
    <ModernContainer>
      <SectionHeader>
        <h2>
          <LanguageIcon />
          Localization Management
        </h2>
        <p>Manage translations and localization data for the survey system</p>
      </SectionHeader>

      {/* Stats Overview */}
      <StatsGrid>
        <StatsCard>
          <h4>{localizations.length}</h4>
          <p>Total Localizations</p>
        </StatsCard>
        <StatsCard>
          <h4>{[...new Set(localizations.map(loc => loc.language_code))].length}</h4>
          <p>Languages Supported</p>
        </StatsCard>
        <StatsCard>
          <h4>{[...new Set(localizations.map(loc => loc.component))].length}</h4>
          <p>Components</p>
        </StatsCard>
      </StatsGrid>

      {/* Form Section */}
      <ModernForm onSubmit={handleSubmit}>
        <InputGroup>
          <Label>Key</Label>
          <ModernInput
            type="text"
            placeholder="Enter localization key"
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
            required
          />
        </InputGroup>
        
        <InputGroup>
          <Label>Language Code</Label>
          <ModernInput
            type="text"
            placeholder="e.g., en, es, fr"
            value={formData.language_code}
            onChange={(e) => setFormData({ ...formData, language_code: e.target.value })}
            required
          />
        </InputGroup>
        
        <InputGroup>
          <Label>Text Content</Label>
          <ModernInput
            type="text"
            placeholder="Translation text"
            value={formData.textcontent}
            onChange={(e) => setFormData({ ...formData, textcontent: e.target.value })}
            required
          />
        </InputGroup>
        
        <InputGroup>
          <Label>Component</Label>
          <ModernInput
            type="text"
            placeholder="Component name"
            value={formData.component}
            onChange={(e) => setFormData({ ...formData, component: e.target.value })}
            required
          />
        </InputGroup>
        
        <ModernButton type="submit" variant="primary">
          <AddIcon />
          {editMode ? 'Update Localization' : 'Create Localization'}
        </ModernButton>
      </ModernForm>

      {/* Table Section */}
      <TableSection>
        <TableHeader>
          <h3>
            <StorageIcon style={{ marginRight: '8px' }} />
            Localization Records ({filteredLocalizations.length})
          </h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <ModernInput
              type="text"
              placeholder="Search localizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '250px' }}
            />
            <ModernButton 
              variant="secondary"
              onClick={() => fetchLocalizations().then(data => setLocalizations(data))}
            >
              🔄 Reload
            </ModernButton>
            <ModernButton 
              variant="secondary"
              onClick={toggleCollapse}
            >
              {isCollapsed ? 'Show' : 'Hide'} Table
            </ModernButton>
          </div>
        </TableHeader>

        {!isCollapsed && (
          <TableContainer>
            {filteredLocalizations.length === 0 ? (
              <EmptyState>
                <LanguageIcon className="icon" />
                <h4>No Localizations Found</h4>
                <p>Add your first localization entry or adjust your search criteria</p>
              </EmptyState>
            ) : (
              <ModernTable>
                <ModernTableHead>
                  <tr>
                    <th>Key</th>
                    <th>Language Code</th>
                    <th>Text Content</th>
                    <th>Component</th>
                    <th>Actions</th>
                  </tr>
                </ModernTableHead>
                <tbody>
                  {filteredLocalizations.map((loc) => (
                    <ModernTableRow key={loc.id}>
                      <ModernTableCell>
                        <strong>{loc.key}</strong>
                      </ModernTableCell>
                      <ModernTableCell>
                        <span style={{
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {loc.language_code.toUpperCase()}
                        </span>
                      </ModernTableCell>
                      <ModernTableCell>
                        {loc.textcontent.length > 50 
                          ? `${loc.textcontent.substring(0, 50)}...` 
                          : loc.textcontent
                        }
                      </ModernTableCell>
                      <ModernTableCell>{loc.component}</ModernTableCell>
                      <ModernTableCell>
                        <ActionButtonGroup>
                          <ActionButton 
                            variant="edit" 
                            onClick={() => handleEdit(loc)}
                          >
                            <EditIcon style={{ fontSize: '16px' }} />
                            Edit
                          </ActionButton>
                          <ActionButton 
                            variant="delete" 
                            onClick={() => handleDelete(loc.id)}
                          >
                            <DeleteIcon style={{ fontSize: '16px' }} />
                            Delete
                          </ActionButton>
                        </ActionButtonGroup>
                      </ModernTableCell>
                    </ModernTableRow>
                  ))}
                </tbody>
              </ModernTable>
            )}
          </TableContainer>
        )}
      </TableSection>
      
      <Snackbar show={showSnackbar}>
        Localization successfully {editMode ? 'updated' : 'created'}!
      </Snackbar>
    </ModernContainer>
  );
};

export default LocalizationUI;
