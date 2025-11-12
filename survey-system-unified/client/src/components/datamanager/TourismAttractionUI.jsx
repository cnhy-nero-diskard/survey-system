import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Place as PlaceIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import {
    createTourismAttraction,
    fetchTourismAttractions,
    updateTourismAttraction,
    deleteTourismAttraction,
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
        <ModernContainer>
            <SectionHeader>
                <h2>
                    <LocationIcon />
                    Tourism Attractions Management
                </h2>
                <p>Manage tourism attractions, locations, and attraction data</p>
            </SectionHeader>

            <StatsGrid>
                <StatsCard>
                    <h4>{attractions.length}</h4>
                    <p>Total Attractions</p>
                </StatsCard>
                <StatsCard>
                    <h4>{filteredAttractions.length}</h4>
                    <p>Filtered Results</p>
                </StatsCard>
                <StatsCard>
                    <h4>{attractions.filter(att => att.report_year === new Date().getFullYear().toString()).length}</h4>
                    <p>Current Year</p>
                </StatsCard>
                <StatsCard>
                    <h4>{new Set(attractions.map(att => att.city_mun)).size}</h4>
                    <p>Cities/Municipalities</p>
                </StatsCard>
            </StatsGrid>

            <ModernForm onSubmit={handleSubmit}>
                <InputGroup>
                    <Label>Tourism Attraction Name</Label>
                    <ModernInput
                        type="text"
                        placeholder="Enter attraction name"
                        value={formData.ta_name}
                        onChange={(e) => setFormData({ ...formData, ta_name: e.target.value })}
                        required={!commaSeparatedValues}
                        disabled={!!commaSeparatedValues}
                    />
                </InputGroup>

                <InputGroup>
                    <Label>Type Code</Label>
                    <ModernInput
                        type="text"
                        placeholder="Enter type code"
                        value={formData.type_code}
                        onChange={(e) => setFormData({ ...formData, type_code: e.target.value })}
                        required={!commaSeparatedValues}
                        disabled={!!commaSeparatedValues}
                    />
                </InputGroup>

                <InputGroup>
                    <Label>Region</Label>
                    <ModernInput
                        type="text"
                        placeholder="Enter region"
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        required={!commaSeparatedValues}
                        disabled={!!commaSeparatedValues}
                    />
                </InputGroup>

                <InputGroup>
                    <Label>Province/HUC</Label>
                    <ModernInput
                        type="text"
                        placeholder="Enter province/HUC"
                        value={formData.prov_huc}
                        onChange={(e) => setFormData({ ...formData, prov_huc: e.target.value })}
                        required={!commaSeparatedValues}
                        disabled={!!commaSeparatedValues}
                    />
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
                    <Label>Report Year</Label>
                    <ModernInput
                        type="number"
                        placeholder="Enter report year"
                        value={formData.report_year}
                        onChange={(e) => setFormData({ ...formData, report_year: e.target.value })}
                        required={!commaSeparatedValues}
                        disabled={!!commaSeparatedValues}
                    />
                </InputGroup>

                <InputGroup>
                    <Label>Barangay</Label>
                    <ModernInput
                        type="text"
                        placeholder="Enter barangay"
                        value={formData.brgy}
                        onChange={(e) => setFormData({ ...formData, brgy: e.target.value })}
                        required={!commaSeparatedValues}
                        disabled={!!commaSeparatedValues}
                    />
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
                    <Label>Tourism Attraction Category</Label>
                    <ModernInput
                        type="text"
                        placeholder="Enter attraction category"
                        value={formData.ta_category}
                        onChange={(e) => setFormData({ ...formData, ta_category: e.target.value })}
                        required={!commaSeparatedValues}
                        disabled={!!commaSeparatedValues}
                    />
                </InputGroup>

                <InputGroup>
                    <Label>NTDP Category</Label>
                    <ModernInput
                        type="text"
                        placeholder="Enter NTDP category"
                        value={formData.ntdp_category}
                        onChange={(e) => setFormData({ ...formData, ntdp_category: e.target.value })}
                        required={!commaSeparatedValues}
                        disabled={!!commaSeparatedValues}
                    />
                </InputGroup>

                <InputGroup>
                    <Label>Development Level</Label>
                    <ModernInput
                        type="text"
                        placeholder="Enter development level"
                        value={formData.devt_lvl}
                        onChange={(e) => setFormData({ ...formData, devt_lvl: e.target.value })}
                        required={!commaSeparatedValues}
                        disabled={!!commaSeparatedValues}
                    />
                </InputGroup>

                <InputGroup>
                    <Label>Management</Label>
                    <ModernInput
                        type="text"
                        placeholder="Enter management info"
                        value={formData.mgt}
                        onChange={(e) => setFormData({ ...formData, mgt: e.target.value })}
                        required={!commaSeparatedValues}
                        disabled={!!commaSeparatedValues}
                    />
                </InputGroup>

                <InputGroup>
                    <Label>Online Connectivity</Label>
                    <ModernInput
                        type="text"
                        placeholder="Enter online connectivity"
                        value={formData.online_connectivity}
                        onChange={(e) => setFormData({ ...formData, online_connectivity: e.target.value })}
                        required={!commaSeparatedValues}
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
                    {editMode ? 'Update Attraction' : 'Create Attraction'}
                </ModernButton>

                <ModernButton 
                    type="button" 
                    variant="secondary"
                    onClick={() => fetchTourismAttractions().then(data => setAttractions(data))}
                >
                    🔄 Reload Data
                </ModernButton>
            </ModernForm>

            <InputGroup style={{ marginBottom: '16px' }}>
                <Label>Search Attractions</Label>
                <ModernInput
                    type="text"
                    placeholder="Search by attraction name, location, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </InputGroup>

            <ModernButton 
                type="button" 
                variant="secondary" 
                onClick={toggleCollapse}
                style={{ width: '100%', marginBottom: '24px' }}
            >
                {isCollapsed ? 'Show Attractions Table' : 'Hide Attractions Table'}
            </ModernButton>

            {!isCollapsed && (
                <TableSection>
                    <TableHeader>
                        <h3>Tourism Attractions ({filteredAttractions.length})</h3>
                    </TableHeader>
                    <TableContainer>
                        <ModernTable>
                            <ModernTableHead>
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
                            </ModernTableHead>
                            <tbody>
                                {filteredAttractions.length > 0 ? (
                                    filteredAttractions.map((att) => (
                                        <ModernTableRow key={att.id}>
                                            <ModernTableCell>{att.ta_name}</ModernTableCell>
                                            <ModernTableCell>{att.type_code}</ModernTableCell>
                                            <ModernTableCell>{att.region}</ModernTableCell>
                                            <ModernTableCell>{att.prov_huc}</ModernTableCell>
                                            <ModernTableCell>{att.city_mun}</ModernTableCell>
                                            <ModernTableCell>{att.report_year}</ModernTableCell>
                                            <ModernTableCell>{att.brgy}</ModernTableCell>
                                            <ModernTableCell>{att.latitude}</ModernTableCell>
                                            <ModernTableCell>{att.longitude}</ModernTableCell>
                                            <ModernTableCell>{att.ta_category}</ModernTableCell>
                                            <ModernTableCell>{att.ntdp_category}</ModernTableCell>
                                            <ModernTableCell>{att.devt_lvl}</ModernTableCell>
                                            <ModernTableCell>{att.mgt}</ModernTableCell>
                                            <ModernTableCell>{att.online_connectivity}</ModernTableCell>
                                            <ModernTableCell>
                                                <ActionButtonGroup>
                                                    <ActionButton variant="edit" onClick={() => handleEdit(att)}>
                                                        <EditIcon />
                                                        Edit
                                                    </ActionButton>
                                                    <ActionButton variant="delete" onClick={() => handleDelete(att.id)}>
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
                                                    <PlaceIcon />
                                                </div>
                                                <h4>No attractions found</h4>
                                                <p>Try adjusting your search criteria or add a new attraction.</p>
                                            </EmptyState>
                                        </ModernTableCell>
                                    </tr>
                                )}
                            </tbody>
                        </ModernTable>
                    </TableContainer>
                </TableSection>
            )}
            
            <Snackbar show={showSnackbar}>
                Attraction successfully {editMode ? 'updated' : 'created'}!
            </Snackbar>
        </ModernContainer>
    );
};

export default TourismAttractionUI;