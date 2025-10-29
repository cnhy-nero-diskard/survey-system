import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import {
  createEstablishment,
  updateEstablishment,
  deleteEstablishment,
  fetchEstablishment,
} from '../utils/crudapi';
import { orange } from '@mui/material/colors';
const API_HOST = process.env.REACT_APP_API_HOST;

// Styled Components (Copied from LocalizationUI)
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
  height:40px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.3);
    outline: none;
  }
`;

const Select = styled.select`
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
  background-color: ${props => props.type === 'success' ? '#4caf50' : '#f44336'};
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: opacity 0.3s ease;
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
    <Container>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <Button
          onClick={() => fetchEstablishment().then(data => setEstablishments(data))}
          style={{ flexShrink: 0 }}
        >
          🔄 Reload
        </Button>
        <Title style={{ margin: 0 }}>Establishments Management</Title>
      </div>

      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Establishment Name"
          value={formData.est_name}
          onChange={(e) => setFormData({ ...formData, est_name: e.target.value })}
          required={!commaSeparatedValues}
          disabled={!!commaSeparatedValues}
        />

        <Select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          required={!commaSeparatedValues}
          disabled={!!commaSeparatedValues}
        >
          <option value="">Select Type</option>
          {establishmentTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </Select>

        <Input
          type="text"
          placeholder="City/Municipality"
          value={formData.city_mun}
          onChange={(e) => setFormData({ ...formData, city_mun: e.target.value })}
          required={!commaSeparatedValues}
          disabled={!!commaSeparatedValues}
        />

        <Select
          value={formData.barangay}
          onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
          required={!commaSeparatedValues}
          disabled={!!commaSeparatedValues}
        >
          <option value="">Select Barangay</option>
          {barangays.map((barangay, index) => (
            <option key={index} value={barangay}>{barangay}</option>
          ))}
        </Select>

        <Input
          type="number"
          placeholder="Latitude"
          value={formData.latitude}
          onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
          required={!commaSeparatedValues}
          disabled={!!commaSeparatedValues}
          step="0.000001"
        />

        <Input
          type="number"
          placeholder="Longitude"
          value={formData.longitude}
          onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
          required={!commaSeparatedValues}
          disabled={!!commaSeparatedValues}
          step="0.000001"
        />

        <Input
          type="text"
          placeholder="English"
          value={formData.english}
          onChange={(e) => setFormData({ ...formData, english: e.target.value })}
          disabled={!!commaSeparatedValues}
        />

        <Input
          type="text"
          placeholder="Korean"
          value={formData.korean}
          onChange={(e) => setFormData({ ...formData, korean: e.target.value })}
          disabled={!!commaSeparatedValues}
        />

        <Input
          type="text"
          placeholder="Chinese"
          value={formData.chinese}
          onChange={(e) => setFormData({ ...formData, chinese: e.target.value })}
          disabled={!!commaSeparatedValues}
        />

        <Input
          type="text"
          placeholder="Japanese"
          value={formData.japanese}
          onChange={(e) => setFormData({ ...formData, japanese: e.target.value })}
          disabled={!!commaSeparatedValues}
        />

        <Input
          type="text"
          placeholder="Russian"
          value={formData.russian}
          onChange={(e) => setFormData({ ...formData, russian: e.target.value })}
          disabled={!!commaSeparatedValues}
        />

        <Input
          type="text"
          placeholder="French"
          value={formData.french}
          onChange={(e) => setFormData({ ...formData, french: e.target.value })}
          disabled={!!commaSeparatedValues}
        />

        <Input
          type="text"
          placeholder="Spanish"
          value={formData.spanish}
          onChange={(e) => setFormData({ ...formData, spanish: e.target.value })}
          disabled={!!commaSeparatedValues}
        />

        <Input
          type="text"
          placeholder="Hindi"
          value={formData.hindi}
          onChange={(e) => setFormData({ ...formData, hindi: e.target.value })}
          disabled={!!commaSeparatedValues}
        />

        <Input
          style={{ background: 'yellow' }}
          type="text"
          placeholder="Comma Separated Values"
          value={commaSeparatedValues}
          onChange={(e) => setCommaSeparatedValues(e.target.value)}
        />

        <Button type="submit">{editMode ? 'Update Establishment' : 'Create Establishment'}</Button>
      </Form>

      <Input
        type="text"
        placeholder="Search Establishments"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <CollapseButton onClick={toggleCollapse}>
        {isCollapsed ? 'Show Establishments' : 'Hide Establishments'}
      </CollapseButton>

      {!isCollapsed && (
        <TableContainer>
          <Table>
            <TableHeader>
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
            </TableHeader>
            <tbody>
              {filteredEstablishments.map((est) => (
                <TableRow key={est.id}>
                  <TableCell>{est.est_name}</TableCell>
                  <TableCell>{est.type}</TableCell>
                  <TableCell>{est.city_mun}</TableCell>
                  <TableCell>{est.barangay}</TableCell>
                  <TableCell>{est.latitude}</TableCell>
                  <TableCell>{est.longitude}</TableCell>
                  <TableCell>{est.en}</TableCell>
                  <TableCell>{est.ko}</TableCell>
                  <TableCell>{est.zh}</TableCell>
                  <TableCell>{est.ja}</TableCell>
                  <TableCell>{est.ru}</TableCell>
                  <TableCell>{est.fr}</TableCell>
                  <TableCell>{est.es}</TableCell>
                  <TableCell>{est.hi}</TableCell>
                  <TableCell>
                    <EditButton onClick={() => handleEdit(est)}>Edit</EditButton>
                    <DeleteButton onClick={() => handleDelete(est.id)}>Delete</DeleteButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}

      <Snackbar show={showSnackbar} type={snackbarType}>
        {snackbarMessage}
      </Snackbar>
    </Container>
  );
};

export default EstablishmentsUI;