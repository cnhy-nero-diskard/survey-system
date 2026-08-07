import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Select,
  MenuItem,
  Box,
  Link,
  Snackbar,
  Button,
  Skeleton,
  CircularProgress,
  Alert,
  IconButton,
  TextField,
  Tooltip,
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import styled from 'styled-components';
import domtoimage from 'dom-to-image';
import { Download, ArrowDropDown, ContentCopy } from '@mui/icons-material';
import { Autocomplete } from '@mui/material';

const StyledLink = styled(Link)`
  color: #3f51b5;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  background-color: rgba(63, 81, 181, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    text-decoration: none;
    color: #1a237e;
    background-color: rgba(63, 81, 181, 0.2);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
`;

const LinkContainer = styled(Box)`
  display: inline-block;
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }
`;

/* 100vw ignores the 300px sidebar, so the page ran off-screen and forced a
   horizontal scrollbar; a fixed 100vh height clipped the generated QR card. */
const StyledContainer = styled(Container)`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  box-sizing: border-box;
`;

const Title = styled(Typography)`
  margin-bottom: 1rem;
  color: #3f51b5;
  font-weight: bold;
  text-align: center;
  font-size: 2rem;
`;

const Subtitle = styled(Typography)`
  margin-bottom: 2rem;
  color: #666;
  text-align: center;
  font-size: 1rem;
`;

const StyledSelect = styled(Select)`
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

const QRCodeContainer = styled(Box)`
  display: inline-block;
  text-align: center;
  padding: 2rem;
  background-color: rgb(255, 255, 255);
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  box-sizing: border-box;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }
`;

const DownloadButton = styled(Button)`
  margin-top: 1rem;
  background: linear-gradient(45deg, #3f51b5, #1a237e);
  color: #ffffff;
  font-weight: bold;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(45deg, #1a237e, #3f51b5);
  }
`;

// `value` must match the key in the touchpointData payload; `label` is what the
// admin reads. Previously two of these were capitalised and the Autocomplete
// label interpolated the raw key ("Select muncity").
const TOUCHPOINT_TYPES = [
  { value: 'muncity', label: 'Municipality/City' },
  { value: 'barangay', label: 'Barangay' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'attractions', label: 'Attractions' },
  { value: 'activities', label: 'Activities' },
  { value: 'establishments', label: 'Establishments' },
  { value: 'point', label: 'Points' },
  { value: 'island', label: 'Island' },
];

const SurveyTouchpoints = () => {
  const [selectedType, setSelectedType] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [touchpointData, setTouchpointData] = useState({
    muncity: [],
    barangay: [],
    transportation: [],
    attractions: [],
    establishments: [],
    point: [],
    island: [],
    activities: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_HOST}/api/surveytouchpoints`, {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(`DATA RECEIVED: ${JSON.stringify(data)}`);
        setTouchpointData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching touchpoints:', error);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      });
  }, []);

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setSelectedItem('');
    setQrValue('');
  };

  const handleItemChange = (event, value) => {
    const selectedKey = value ? value.short_id : '';
    setSelectedItem(selectedKey);
    // Clearing the Autocomplete must clear the QR too, otherwise a stale code
    // stays on screen pointing at the previous touchpoint.
    setQrValue(selectedKey ? `${process.env.REACT_APP_SELF_URL}/feedback?idx=${selectedKey}` : '');
  };

  const generateQRCode = (value) => {
    return <QRCodeSVG value={value} size={256} includeMargin={true} level="H" />;
  };

  const handleDownloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) {
      console.error('SVG element not found');
      return;
    }
    domtoimage
      .toPng(svg)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${selectedItem}_QRCode.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error('Error generating image:', error);
      });
  };

  const handleCopyLink = (link) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        // A blocking window.alert() for a copy confirmation is jarring and is
        // the only modal dialog in the admin UI; use the same Snackbar the
        // rest of the app uses.
        setToast('Link copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy link:', err);
        setError('Could not copy the link to your clipboard.');
      });
  };

  const handleCloseError = () => {
    setError('');
  };

  const getTouchpointItems = () => {
    if (!selectedType) return [];
    return touchpointData[selectedType] || [];
  };

  const selectedTypeLabel = TOUCHPOINT_TYPES.find((t) => t.value === selectedType)?.label || 'item';

  return (
    <>
      <StyledContainer maxWidth="lg">
        {/* Permanent QR Code Section */}
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={8}>
            <QRCodeContainer>
              <Title variant="h5" gutterBottom>
                TOURISM PRODUCT MARKET SURVEY
              </Title>
              <Subtitle variant="body1">Scan the QR code below to access the survey.</Subtitle>
              {generateQRCode(`${process.env.REACT_APP_SELF_URL}/survey/`)}
              <LinkContainer>
                <StyledLink
                  href={`${process.env.REACT_APP_SELF_URL}/survey/`}
                  target="_blank"
                  rel="noopener"
                >
                  {`${process.env.REACT_APP_SELF_URL}/survey/`}
                </StyledLink>
                <Tooltip title="Copy survey link">
                  <IconButton
                    aria-label="Copy survey link"
                    onClick={() => handleCopyLink(`${process.env.REACT_APP_SELF_URL}/survey/`)}
                    sx={{ ml: 1 }}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Tooltip>
              </LinkContainer>
            </QRCodeContainer>
          </Grid>
        </Grid>

        {/* Dynamic QR Code Generator Section */}
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
          <Grid item xs={12} md={8}>
            <QRCodeContainer>
              <Title variant="h6" gutterBottom>
                Generate QR Code for Touchpoints
              </Title>
              <Subtitle variant="body1">Select a type and item to generate a QR code.</Subtitle>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <StyledSelect
                    value={selectedType}
                    onChange={handleTypeChange}
                    displayEmpty
                    aria-label="Select Type"
                    IconComponent={ArrowDropDown}
                  >
                    <MenuItem value="" disabled>
                      Select Type
                    </MenuItem>
                    {TOUCHPOINT_TYPES.map(({ value, label }) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                </Grid>
                <Grid item xs={12} md={6}>
                  {loading ? (
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <CircularProgress
                        size={24}
                        thickness={4}
                        sx={{ color: '#667eea' }}
                        aria-label="Loading touchpoints"
                      />
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    </Box>
                  ) : (
                    <Autocomplete
                      options={getTouchpointItems()}
                      getOptionLabel={(option) => option.name || ''}
                      isOptionEqualToValue={(option, value) => option.short_id === value.short_id}
                      onChange={handleItemChange}
                      disabled={!selectedType}
                      noOptionsText={`No ${selectedTypeLabel.toLowerCase()} touchpoints found`}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            selectedType ? `Select ${selectedTypeLabel}` : 'Select a type first'
                          }
                          variant="outlined"
                        />
                      )}
                    />
                  )}
                </Grid>
              </Grid>
              {qrValue && (
                <>
                  <Box id="qr-code-svg" sx={{ mt: 3 }}>
                    {generateQRCode(qrValue)}
                  </Box>
                  <LinkContainer>
                    <StyledLink href={qrValue} target="_blank" rel="noopener">
                      {qrValue}
                    </StyledLink>
                    <Tooltip title="Copy touchpoint link">
                      <IconButton
                        aria-label="Copy touchpoint link"
                        onClick={() => handleCopyLink(qrValue)}
                        sx={{ ml: 1 }}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </LinkContainer>
                  <DownloadButton onClick={handleDownloadQRCode} startIcon={<Download />}>
                    Download QR Code
                  </DownloadButton>
                </>
              )}
            </QRCodeContainer>
          </Grid>
        </Grid>
        {/* Error handling. The Alert here used to be commented out, leaving a
            Snackbar with no child — so fetch failures surfaced nothing at all. */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="error" onClose={handleCloseError} sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!toast}
          autoHideDuration={3000}
          onClose={() => setToast('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={() => setToast('')} sx={{ width: '100%' }}>
            {toast}
          </Alert>
        </Snackbar>
      </StyledContainer>
    </>
  );
};

export default SurveyTouchpoints;
