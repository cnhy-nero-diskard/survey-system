// EditAttractionDialog.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const EditAttractionDialog = ({ open, onClose, attraction, handleInputChange, handleUpdateAttraction }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Tourism Attraction</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Name"
                    name="TA_Name"
                    value={attraction?.TA_Name || ''}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Type Code"
                    name="Type_Code"
                    value={attraction?.Type_Code || ''}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Region"
                    name="Region"
                    value={attraction?.Region || ''}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Province/HUC"
                    name="Prov_HUC"
                    value={attraction?.Prov_HUC || ''}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="City/Municipality"
                    name="City_Mun"
                    value={attraction?.City_Mun || ''}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Report Year"
                    name="Report_Year"
                    value={attraction?.Report_Year || ''}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Barangay"
                    name="Brgy"
                    value={attraction?.Brgy || ''}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Latitude"
                    name="Latitude"
                    value={attraction?.Latitude || ''}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Longitude"
                    name="Longitude"
                    value={attraction?.Longitude || ''}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Category"
                    name="TA_Category"
                    value={attraction?.TA_Category || ''}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="NTDP Category"
                    name="NTDP_Category"
                    value={attraction?.NTDP_Category || ''}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Development Level"
                    name="Devt_Lvl"
                    value={attraction?.Devt_Lvl || ''}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Management"
                    name="Mgt"
                    value={attraction?.Mgt || ''}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Online Connectivity"
                    name="Online_Connectivity"
                    value={attraction?.Online_Connectivity || ''}
                    onChange={handleInputChange}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleUpdateAttraction}>Update</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditAttractionDialog;