import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Business as BusinessIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Store as StoreIcon,
} from '@mui/icons-material';
import {
  createEstablishment,
  updateEstablishment,
  deleteEstablishment,
  fetchEstablishment,
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

const API_HOST = process.env.REACT_APP_API_HOST;

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

const EstablishmentsUI = () => {
  const [establishments, setEstablishments] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [establishmentTypes, setEstablishmentTypes] = useState([]);
  const [formData, setFormData] = useState({
    est_name: '',
    type: '',
    city_mun: 'PANGLAO',
    barangay: '',
    latitude: '9.578',
    longitude: '123.744900',
    english: '',
    korean: '',
    chinese: '',
    japanese: '',
    russian: '',
    french: '',
    spanish: '',
    hindi: '',
  });
  const [commaSeparatedValues, setCommaSeparatedValues] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');

  useEffect(() => {
    // Fetch establishments
    fetchEstablishment().then((data) => {
      setEstablishments(data);
    });

    // Fetch barangays
    fetch(`${API_HOST}/api/admin/locations?location_type=barangay`,

      {
        credentials: "include",
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then(response => response.json())
      .then(data => {
        setBarangays(data.map(item => item.name));
      })
      .catch(error => {
        console.error('Error fetching barangays:', error);
      });

    // Fetch establishment types
    fetch(`${API_HOST}/api/admin/estabtypes`,
      {
        credentials: "include",
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then(response => response.json())
      .then(data => {
        setEstablishmentTypes(data.map(item => item.type_name));
      })
      .catch(error => {
        console.error('Error fetching establishment types:', error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let updatedFormData = formData;

      if (commaSeparatedValues.trim()) {
        const parsedValues = commaSeparatedValues.split(',').map(value => value.trim());
        updatedFormData = {
          est_name: parsedValues[0] || formData.est_name,
          type: parsedValues[1] || formData.type,
          city_mun: parsedValues[2] || formData.city_mun,
          barangay: parsedValues[3] || formData.barangay,
          latitude: parsedValues[4] || formData.latitude,
          longitude: parsedValues[5] || formData.longitude,
          english: parsedValues[6] || formData.en,
          korean: parsedValues[7] || formData.ko,
          chinese: parsedValues[8] || formData.zh,
          japanese: parsedValues[9] || formData.ja,
          russian: parsedValues[10] || formData.ru,
          french: parsedValues[11] || formData.fr,
          spanish: parsedValues[12] || formData.es,
          hindi: parsedValues[13] || formData.hi,
        };
      }

      if (editMode) {
        // Update establishment
        const updatedEstablishment = await updateEstablishment(editMode, updatedFormData);
        setEstablishments(establishments.map((est) => (est.id === editMode ? updatedEstablishment : est)));
        setEditMode(null);
        setSnackbarMessage('Establishment successfully updated!');
        setSnackbarType('success');
      } else {
        // Create new establishment
        const newEstablishment = await createEstablishment(updatedFormData);

        if (newEstablishment.error) {
          setSnackbarMessage(newEstablishment.error);
          setSnackbarType('error');
        } else {
          setEstablishments([...establishments, newEstablishment]);
          setSnackbarMessage('Establishment successfully created!');
          setSnackbarType('success');
        }
      }

      // Reset the form
      setFormData({
        est_name: '',
        type: '',
        city_mun: 'PANGLAO',
        barangay: '',
        latitude: '9.578',
        longitude: '123.744900',
        english: '',
        korean: '',
        chinese: '',
        japanese: '',
        russian: '',
        french: '',
        spanish: '',
        hindi: '',
      });
      setCommaSeparatedValues('');

      // Show snackbar
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 3000);
    } catch (error) {
      console.error('Error submitting establishment:', error);
      setSnackbarMessage('An unexpected error occurred. Please try again.');
      setSnackbarType('error');
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 3000);
    }
  };

  const handleDelete = async (id) => {
    await deleteEstablishment(id);
    setEstablishments(establishments.filter((est) => est.id !== id));
  };

  const handleEdit = (establishment) => {
    setFormData(establishment);
    setEditMode(establishment.id);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const filteredEstablishments = establishments.filter((est) => {
    try {
      return est.est_name.toLowerCase().includes(searchQuery.toLowerCase());
    } catch (error) {
      console.error("Error filtering establishment:", error);
      return false;
    }
  });

  return (
    <ModernContainer>
      <SectionHeader>
        <h2>
          <StoreIcon />
          Establishments Management
        </h2>
        <p>Manage tourism establishments, locations, and multilingual content</p>
      </SectionHeader>

      <StatsGrid>
        <StatsCard>
          <h4>{establishments.length}</h4>
          <p>Total Establishments</p>
        </StatsCard>
        <StatsCard>
          <h4>{filteredEstablishments.length}</h4>
          <p>Filtered Results</p>
        </StatsCard>
        <StatsCard>
          <h4>{barangays.length}</h4>
          <p>Available Barangays</p>
        </StatsCard>
        <StatsCard>
          <h4>{establishmentTypes.length}</h4>
          <p>Establishment Types</p>
        </StatsCard>
      </StatsGrid>

      <ModernForm onSubmit={handleSubmit}>
        <InputGroup>
          <Label>Establishment Name</Label>
          <ModernInput
            type="text"
            placeholder="Enter establishment name"
            value={formData.est_name}
            onChange={(e) => setFormData({ ...formData, est_name: e.target.value })}
            required={!commaSeparatedValues}
            disabled={!!commaSeparatedValues}
          />
        </InputGroup>

        <InputGroup>
          <Label>Type</Label>
          <ModernSelect
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required={!commaSeparatedValues}
            disabled={!!commaSeparatedValues}
          >
            <option value="">Select Type</option>
            {establishmentTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </ModernSelect>
        </InputGroup>

        <InputGroup>
          <Label>City/Municipality</Label>
          <ModernInput
            type="text"
            placeholder="Enter city/municipality"
            value={formData.city_mun}
            onChange={(e) => setFormData({ ...formData, city_mun: e.target.value })}
            required={!commaSeparatedValues}
            disabled={!!commaSeparatedValues}
          />
        </InputGroup>

        <InputGroup>
          <Label>Barangay</Label>
          <ModernSelect
            value={formData.barangay}
            onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
            required={!commaSeparatedValues}
            disabled={!!commaSeparatedValues}
          >
            <option value="">Select Barangay</option>
            {barangays.map((barangay, index) => (
              <option key={index} value={barangay}>{barangay}</option>
            ))}
          </ModernSelect>
        </InputGroup>

        <InputGroup>
          <Label>Latitude</Label>
          <ModernInput
            type="number"
            placeholder="Enter latitude"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
            required={!commaSeparatedValues}
            disabled={!!commaSeparatedValues}
            step="0.000001"
          />
        </InputGroup>

        <InputGroup>
          <Label>Longitude</Label>
          <ModernInput
            type="number"
            placeholder="Enter longitude"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
            required={!commaSeparatedValues}
            disabled={!!commaSeparatedValues}
            step="0.000001"
          />
        </InputGroup>

        <InputGroup>
          <Label>English</Label>
          <ModernInput
            type="text"
            placeholder="English translation"
            value={formData.english}
            onChange={(e) => setFormData({ ...formData, english: e.target.value })}
            disabled={!!commaSeparatedValues}
          />
        </InputGroup>

        <InputGroup>
          <Label>Korean</Label>
          <ModernInput
            type="text"
            placeholder="Korean translation"
            value={formData.korean}
            onChange={(e) => setFormData({ ...formData, korean: e.target.value })}
            disabled={!!commaSeparatedValues}
          />
        </InputGroup>

        <InputGroup>
          <Label>Chinese</Label>
          <ModernInput
            type="text"
            placeholder="Chinese translation"
            value={formData.chinese}
            onChange={(e) => setFormData({ ...formData, chinese: e.target.value })}
            disabled={!!commaSeparatedValues}
          />
        </InputGroup>

        <InputGroup>
          <Label>Japanese</Label>
          <ModernInput
            type="text"
            placeholder="Japanese translation"
            value={formData.japanese}
            onChange={(e) => setFormData({ ...formData, japanese: e.target.value })}
            disabled={!!commaSeparatedValues}
          />
        </InputGroup>

        <InputGroup>
          <Label>Russian</Label>
          <ModernInput
            type="text"
            placeholder="Russian translation"
            value={formData.russian}
            onChange={(e) => setFormData({ ...formData, russian: e.target.value })}
            disabled={!!commaSeparatedValues}
          />
        </InputGroup>

        <InputGroup>
          <Label>French</Label>
          <ModernInput
            type="text"
            placeholder="French translation"
            value={formData.french}
            onChange={(e) => setFormData({ ...formData, french: e.target.value })}
            disabled={!!commaSeparatedValues}
          />
        </InputGroup>

        <InputGroup>
          <Label>Spanish</Label>
          <ModernInput
            type="text"
            placeholder="Spanish translation"
            value={formData.spanish}
            onChange={(e) => setFormData({ ...formData, spanish: e.target.value })}
            disabled={!!commaSeparatedValues}
          />
        </InputGroup>

        <InputGroup>
          <Label>Hindi</Label>
          <ModernInput
            type="text"
            placeholder="Hindi translation"
            value={formData.hindi}
            onChange={(e) => setFormData({ ...formData, hindi: e.target.value })}
            disabled={!!commaSeparatedValues}
          />
        </InputGroup>

        <InputGroup>
          <Label>Comma Separated Values</Label>
          <ModernInput
            style={{ background: '#fff3cd' }}
            type="text"
            placeholder="Enter comma separated values for bulk input"
            value={commaSeparatedValues}
            onChange={(e) => setCommaSeparatedValues(e.target.value)}
          />
        </InputGroup>

        <ModernButton type="submit" variant="primary">
          <AddIcon />
          {editMode ? 'Update Establishment' : 'Create Establishment'}
        </ModernButton>

        <ModernButton 
          type="button" 
          variant="secondary"
          onClick={() => fetchEstablishment().then(data => setEstablishments(data))}
        >
          🔄 Reload Data
        </ModernButton>
      </ModernForm>

      <InputGroup style={{ marginBottom: '16px' }}>
        <Label>Search Establishments</Label>
        <ModernInput
          type="text"
          placeholder="Search by establishment name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>

      <ModernButton 
        type="button" 
        variant="secondary" 
        onClick={toggleCollapse}
        style={{ width: '100%', marginBottom: '24px' }}
      >
        {isCollapsed ? 'Show Establishments Table' : 'Hide Establishments Table'}
      </ModernButton>

      {!isCollapsed && (
        <TableSection>
          <TableHeader>
            <h3>Establishments ({filteredEstablishments.length})</h3>
          </TableHeader>
          <TableContainer>
            <ModernTable>
              <ModernTableHead>
                <tr>
                  <th>Establishment Name</th>
                  <th>Type</th>
                  <th>City/Municipality</th>
                  <th>Barangay</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>English</th>
                  <th>Korean</th>
                  <th>Chinese</th>
                  <th>Japanese</th>
                  <th>Russian</th>
                  <th>French</th>
                  <th>Spanish</th>
                  <th>Hindi</th>
                  <th>Actions</th>
                </tr>
              </ModernTableHead>
              <tbody>
                {filteredEstablishments.length > 0 ? (
                  filteredEstablishments.map((est) => (
                    <ModernTableRow key={est.id}>
                      <ModernTableCell>{est.est_name}</ModernTableCell>
                      <ModernTableCell>{est.type}</ModernTableCell>
                      <ModernTableCell>{est.city_mun}</ModernTableCell>
                      <ModernTableCell>{est.barangay}</ModernTableCell>
                      <ModernTableCell>{est.latitude}</ModernTableCell>
                      <ModernTableCell>{est.longitude}</ModernTableCell>
                      <ModernTableCell>{est.en}</ModernTableCell>
                      <ModernTableCell>{est.ko}</ModernTableCell>
                      <ModernTableCell>{est.zh}</ModernTableCell>
                      <ModernTableCell>{est.ja}</ModernTableCell>
                      <ModernTableCell>{est.ru}</ModernTableCell>
                      <ModernTableCell>{est.fr}</ModernTableCell>
                      <ModernTableCell>{est.es}</ModernTableCell>
                      <ModernTableCell>{est.hi}</ModernTableCell>
                      <ModernTableCell>
                        <ActionButtonGroup>
                          <ActionButton variant="edit" onClick={() => handleEdit(est)}>
                            <EditIcon />
                            Edit
                          </ActionButton>
                          <ActionButton variant="delete" onClick={() => handleDelete(est.id)}>
                            <DeleteIcon />
                            Delete
                          </ActionButton>
                        </ActionButtonGroup>
                      </ModernTableCell>
                    </ModernTableRow>
                  ))
                ) : (
                  <tr>
                    <ModernTableCell colSpan="15">
                      <EmptyState>
                        <div className="icon">
                          <StoreIcon />
                        </div>
                        <h4>No establishments found</h4>
                        <p>Try adjusting your search criteria or add a new establishment.</p>
                      </EmptyState>  
                    </ModernTableCell>
                  </tr>
                )}
              </tbody>
            </ModernTable>
          </TableContainer>
        </TableSection>
      )}

      <Snackbar show={showSnackbar} type={snackbarType}>
        {snackbarMessage}
      </Snackbar>
    </ModernContainer>
  );
};

export default EstablishmentsUI;