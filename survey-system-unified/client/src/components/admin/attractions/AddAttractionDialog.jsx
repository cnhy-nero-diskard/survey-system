// AddAttractionDialog.js
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

const AddAttractionDialog = ({ open, onClose, newAttraction, handleInputChange, handleAddAttraction }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Attraction</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Name"
          name="TA_Name"
          fullWidth
          value={newAttraction.TA_Name}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Type Code"
          name="Type_Code"
          fullWidth
          value={newAttraction.Type_Code}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Region"
          name="Region"
          fullWidth
          value={newAttraction.Region}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Province/HUC"
          name="Prov_HUC"
          fullWidth
          value={newAttraction.Prov_HUC}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="City/Municipality"
          name="City_Mun"
          fullWidth
          value={newAttraction.City_Mun}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Report Year"
          name="Report_Year"
          fullWidth
          value={newAttraction.Report_Year}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Barangay"
          name="Brgy"
          fullWidth
          value={newAttraction.Brgy}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Latitude"
          name="Latitude"
          fullWidth
          value={newAttraction.Latitude}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Longitude"
          name="Longitude"
          fullWidth
          value={newAttraction.Longitude}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Category"
          name="TA_Category"
          fullWidth
          value={newAttraction.TA_Category}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="NTDP Category"
          name="NTDP_Category"
          fullWidth
          value={newAttraction.NTDP_Category}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Development Level"
          name="Devt_Lvl"
          fullWidth
          value={newAttraction.Devt_Lvl}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Management"
          name="Mgt"
          fullWidth
          value={newAttraction.Mgt}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Online Connectivity"
          name="Online_Connectivity"
          fullWidth
          value={newAttraction.Online_Connectivity}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddAttraction} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAttractionDialog;