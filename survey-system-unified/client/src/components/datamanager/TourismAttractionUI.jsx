// TourismAttractionUI.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
    createTourismAttraction,
    fetchTourismAttractions,
    updateTourismAttraction,
    deleteTourismAttraction,
} from '../utils/crudapi';

// Styled Components (Reused from LocalizationUI.jsx)
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
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.3));
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

const TourismAttractionUI = () => {
    const [attractions, setAttractions] = useState([]);
    const [formData, setFormData] = useState({
      ta_name: '',
      type_code: '',
      region: '',
      prov_huc: '',
      city_mun: '',
      report_year: new Date().getFullYear().toString(), 
      brgy: '',
      latitude: '9.5780',  
      longitude: '123.744900', 
      ta_category: '',
      ntdp_category: '',
      devt_lvl: '',
      mgt: '',
      online_connectivity: '',
    });
    const [commaSeparatedValues, setCommaSeparatedValues] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editMode, setEditMode] = useState(null);
    const [showSnackbar, setShowSnackbar] = useState(false);

    useEffect(() => {
        console.log(`FETCHING TOURISM ATTRACTIONS`);
        fetchTourismAttractions().then((data) => setAttractions(data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let updatedFormData = formData;

            if (commaSeparatedValues.trim()) {
                const parsedValues = commaSeparatedValues.split(',').map(value => value.trim());
                updatedFormData = {
                    ta_name: parsedValues[0] || formData.ta_name,
                    type_code: parsedValues[1] || formData.type_code,
                    region: parsedValues[2] || formData.region,
                    prov_huc: parsedValues[3] || formData.prov_huc,
                    city_mun: parsedValues[4] || formData.city_mun,
                    report_year: parsedValues[5] || formData.report_year,
                    brgy: parsedValues[6] || formData.brgy,
                    latitude: parsedValues[7] || formData.latitude,
                    longitude: parsedValues[8] || formData.longitude,
                    ta_category: parsedValues[9] || formData.ta_category,
                    ntdp_category: parsedValues[10] || formData.ntdp_category,
                    devt_lvl: parsedValues[11] || formData.devt_lvl,
                    mgt: parsedValues[12] || formData.mgt,
                    online_connectivity: parsedValues[13] || formData.online_connectivity,
                };
            }
            if (editMode) {
                // Update attraction
                const updatedAttraction = await updateTourismAttraction(editMode, formData);
                setAttractions(attractions.map((att) => (att.id === editMode ? updatedAttraction : att)));
                setEditMode(null);
            } else {
                // Create new attraction
                console.log(`CREATE TOURISM - ${JSON.stringify(updatedFormData)}`)
                const newAttraction = await createTourismAttraction(updatedFormData);
                setAttractions([...attractions, newAttraction]);
            }

            // Reset the form
            setFormData({
                ta_name: '',
                type_code: '',
                region: '',
                prov_huc: '',
                city_mun: '',
                report_year: '',
                brgy: '',
                latitude: '',
                longitude: '',
                ta_category: '',
                ntdp_category: '',
                devt_lvl: '',
                mgt: '',
                online_connectivity: '',
            });

            // Show snackbar
            setShowSnackbar(true);
            setTimeout(() => setShowSnackbar(false), 3000);
        } catch (error) {
            console.error('Error submitting tourism attraction:', error);
        }
    };

    const handleDelete = async (id) => {
        await deleteTourismAttraction(id);
        setAttractions(attractions.filter((att) => att.id !== id));
    };

    const handleEdit = (attraction) => {
        setFormData(attraction);
        setEditMode(attraction.id);
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const filteredAttractions = attractions.filter((att) =>
        Object.values(att).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <Container>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <Button
                    onClick={() => fetchTourismAttractions().then(data => setAttractions(data))}
                    style={{ flexShrink: 0 }}
                >
                    🔄 Reload
                </Button>
                <Title style={{ margin: 0 }}>Tourism Attractions Management</Title>
            </div>
            <Form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    placeholder="Tourism Attraction Name"
                    value={formData.ta_name}
                    onChange={(e) => setFormData({ ...formData, ta_name: e.target.value })}
                    required={!commaSeparatedValues}
                    disabled={!!commaSeparatedValues}

                />
                <Input
                    type="text"
                    placeholder="Type Code"
                    value={formData.type_code}
                    onChange={(e) => setFormData({ ...formData, type_code: e.target.value })}
                    required={!commaSeparatedValues}
                    disabled={!!commaSeparatedValues}

                />
                <Input
                    type="text"
                    placeholder="Region"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    required={!commaSeparatedValues}
                    disabled={!!commaSeparatedValues}

                />
                <Input
                    type="text"
                    placeholder="Province/HUC"
                    value={formData.prov_huc}
                    onChange={(e) => setFormData({ ...formData, prov_huc: e.target.value })}
                    required={!commaSeparatedValues}
                    disabled={!!commaSeparatedValues}

                />
                <Input
                    type="text"
                    placeholder="City/Municipality"
                    value={formData.city_mun}
                    onChange={(e) => setFormData({ ...formData, city_mun: e.target.value })}
                    required={!commaSeparatedValues}
                    disabled={!!commaSeparatedValues}

                />
                <Input
                    type="number"
                    placeholder="Report Year"
                    value={formData.report_year}
                    onChange={(e) => setFormData({ ...formData, report_year: e.target.value })}
                    required={!commaSeparatedValues}
                    disabled={!!commaSeparatedValues}

                />
                <Input
                    type="text"
                    placeholder="Barangay"
                    value={formData.brgy}
                    onChange={(e) => setFormData({ ...formData, brgy: e.target.value })}
                    required={!commaSeparatedValues}
                    disabled={!!commaSeparatedValues}

                />
                <Input
                    type="number"
                    placeholder="Latitude"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    required={!commaSeparatedValues}
                    disabled={!!commaSeparatedValues}

                />
                <Input
                    type="number"
                    placeholder="Longitude"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    required={!commaSeparatedValues}
                    disabled={!!commaSeparatedValues}

                />
                <Input
                    type="text"
                    placeholder="Tourism Attraction Category"
                    value={formData.ta_category}
                    onChange={(e) => setFormData({ ...formData, ta_category: e.target.value })}
                    required={!commaSeparatedValues}
                    disabled={!!commaSeparatedValues}

                />
                <Input
                    type="text"
                    placeholder="NTDP Category"
                    value={formData.ntdp_category}
                    onChange={(e) => setFormData({ ...formData, ntdp_category: e.target.value })}
                    required={!commaSeparatedValues}
                    disabled={!!commaSeparatedValues}

                />
                <Input
                    type="text"
                    placeholder="Development Level"
                    value={formData.devt_lvl}
                    onChange={(e) => setFormData({ ...formData, devt_lvl: e.target.value })}
                    required={!commaSeparatedValues}
                    disabled={!!commaSeparatedValues}

                />
                <Input
                    type="text"
                    placeholder="Management"
                    value={formData.mgt}
                    onChange={(e) => setFormData({ ...formData, mgt: e.target.value })}
                    required={!commaSeparatedValues}
                    disabled={!!commaSeparatedValues}

                />
                <Input
                    type="text"
                    placeholder="Online Connectivity"
                    value={formData.online_connectivity}
                    onChange={(e) => setFormData({ ...formData, online_connectivity: e.target.value })}
                    required={!commaSeparatedValues}
                    disabled={!!commaSeparatedValues}

                />
                <Input
                    style={{ background: 'yellow' }}
                    type="text"
                    placeholder="Comma Separated Values"
                    value={commaSeparatedValues}
                    onChange={(e) => setCommaSeparatedValues(e.target.value)}
                />

                <Button type="submit">{editMode ? 'Update Attraction' : 'Create Attraction'}</Button>
            </Form>

            <CollapseButton onClick={toggleCollapse}>
                {isCollapsed ? 'Show Attractions' : 'Hide Attractions'}
            </CollapseButton>

            {!isCollapsed && (
                <>
                    <SearchInput
                        type="text"
                        placeholder="Search attractions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <TableContainer>
                        <Table>
                            <TableHeader>
                                <tr>
                                    <th>Name</th>
                                    <th>Type Code</th>
                                    <th>Region</th>
                                    <th>Province/HUC</th>
                                    <th>City/Municipality</th>
                                    <th>Report Year</th>
                                    <th>Barangay</th>
                                    <th>Latitude</th>
                                    <th>Longitude</th>
                                    <th>Category</th>
                                    <th>NTDP Category</th>
                                    <th>Development Level</th>
                                    <th>Management</th>
                                    <th>Online Connectivity</th>
                                    <th>Actions</th>
                                </tr>
                            </TableHeader>
                            <tbody>
                                {filteredAttractions.map((att) => (
                                    <TableRow key={att.id}>
                                        <TableCell>{att.ta_name}</TableCell>
                                        <TableCell>{att.type_code}</TableCell>
                                        <TableCell>{att.region}</TableCell>
                                        <TableCell>{att.prov_huc}</TableCell>
                                        <TableCell>{att.city_mun}</TableCell>
                                        <TableCell>{att.report_year}</TableCell>
                                        <TableCell>{att.brgy}</TableCell>
                                        <TableCell>{att.latitude}</TableCell>
                                        <TableCell>{att.longitude}</TableCell>
                                        <TableCell>{att.ta_category}</TableCell>
                                        <TableCell>{att.ntdp_category}</TableCell>
                                        <TableCell>{att.devt_lvl}</TableCell>
                                        <TableCell>{att.mgt}</TableCell>
                                        <TableCell>{att.online_connectivity}</TableCell>
                                        <TableCell>
                                            <EditButton onClick={() => handleEdit(att)}>Edit</EditButton>
                                            <DeleteButton onClick={() => handleDelete(att.id)}>Delete</DeleteButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </tbody>
                        </Table>
                    </TableContainer>
                </>
            )}
            <Snackbar show={showSnackbar}>Attraction successfully {editMode ? 'updated' : 'created'}!</Snackbar>
        </Container>
    );
};

export default TourismAttractionUI;