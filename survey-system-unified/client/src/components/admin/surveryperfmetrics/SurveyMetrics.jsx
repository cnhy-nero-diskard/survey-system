import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    useTheme,
    Modal,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Fade,
    Backdrop,
    Chip,
    IconButton,
    Skeleton,
    CircularProgress
} from '@mui/material';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import GroupIcon from '@mui/icons-material/Group';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import PlaceIcon from '@mui/icons-material/Place';
import styled, { ThemeProvider as StyledThemeProvider, keyframes } from 'styled-components';
import { fontFamily } from '../../../config/fontConfig';
import * as XLSX from 'xlsx';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const scaleIn = keyframes`
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

// Styled components
const StyledDashboardContainer = styled(Box)`
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 1rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  animation: ${fadeIn} 0.8s ease-out;
  box-sizing: border-box;
  position: relative;
  overflow-x: hidden;
  padding-top: 2rem; /* Ensure title has enough space */
`;

const StyledHeaderCard = styled(Card)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin: 0 0 1rem 0;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  animation: ${slideIn} 0.6s ease-out;
  
  .MuiCardContent-root {
    padding: 1rem;
  }
`;

/* Only the cards that actually open a modal get the pointer + lift. Four of the
   nine advertised a click that did nothing. Pass `clickable` alongside onClick. */
const StyledMetricCard = styled(Card).withConfig({
  shouldForwardProp: (prop) => !['gradient', 'clickable'].includes(prop),
})`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
  height: 100%;
  position: relative;
  overflow: hidden;
  animation: ${scaleIn} 0.5s ease-out;

  &:hover {
    transform: ${({ clickable }) => (clickable ? 'translateY(-8px) scale(1.02)' : 'translateY(-2px)')};
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  &:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 3px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ gradient }) => gradient || 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'};
  }
  
  .MuiCardContent-root {
    padding: 1rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
`;

const StyledMetricIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  color: ${({ color }) => color};
  background: ${({ color }) => `${color}20`};
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const StyledExportButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 25px;
  padding: 12px 30px;
  text-transform: none;
  font-weight: 600;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  }
`;

const StyledModal = styled(Modal)`
  .MuiBackdrop-root {
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
  }
`;

const StyledModalContent = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 1200px;
  max-height: 85vh;
  background: white;
  border-radius: 20px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  overflow-y: auto;
  animation: ${scaleIn} 0.3s ease-out;
`;

const StyledChip = styled(Chip)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  margin: 0.25rem;
  
  &:hover {
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  }
`;

const StyledTableContainer = styled(TableContainer)`
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  
  .MuiTableHead-root {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    
    .MuiTableCell-head {
      color: white;
      font-weight: 600;
      font-size: 1rem;
    }
  }
  
  .MuiTableRow-root:nth-of-type(even) {
    background-color: rgba(102, 126, 234, 0.05);
  }
  
  .MuiTableRow-root:hover {
    background-color: rgba(102, 126, 234, 0.1);
  }
`;

const SurveyMetrics = () => {
    const theme = useTheme();

    // State to hold survey metrics fetched from server
    const [surveyMetrics, setSurveyMetrics] = useState(null);
    const [loadError, setLoadError] = useState(null);

    // State control for modals
    const [open, setOpen] = useState(false);
    const [openDistributionModal, setOpenDistributionModal] = useState(false);

    // New state for Nationality (Region) Modal
    const [openNationalityModal, setOpenNationalityModal] = useState(false);
    const [openCountryModal, setOpenCountryModal] = useState(false);

    // Fetch data from server
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_HOST}/api/admin/getsurveymetrics`, { withCredentials: true })
            .then((response) => {
                setSurveyMetrics(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching Survey Metrics:', error);
                // Without this the page sat on "Loading Survey Metrics..." forever.
                setLoadError(error.response?.data?.message || error.message || 'Request failed');
            });
    }, []);

    // Open & close modals
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleDistributionOpen = () => setOpenDistributionModal(true);
    const handleDistributionClose = () => setOpenDistributionModal(false);

    // Handlers for the Nationality modal
    const handleNationalityOpen = () => setOpenNationalityModal(true);
    const handleCountryOpen = () => setOpenCountryModal(true);
    const handleNationalityClose = () => setOpenNationalityModal(false);
    const handleCountryClose = () => setOpenCountryModal(false);
    const [openAgeGroupModal, setOpenAgeGroupModal] = useState(false);
    const handleAgeGroupOpen = () => setOpenAgeGroupModal(true);
    const handleAgeGroupClose = () => setOpenAgeGroupModal(false);

    const NoData = () => (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                color: 'text.secondary',
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                borderRadius: '15px',
                border: '2px dashed #cbd5e0',
                margin: '1rem 0'
            }}
        >
            <AnalyticsIcon sx={{ fontSize: '3rem', color: '#9ca3af', mb: 1 }} />
            <Typography variant="h6" color="text.secondary">
                No Data Available
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Data will appear here when available
            </Typography>
        </Box>
    );
    // Function to get current time in a readable format
    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleString();
    };

    // Function to get the current month

    const getCurrentMonth = () => {
        const now = new Date();
        const month = now.toLocaleString('default', { month: 'long' }).toLowerCase();
        const year = now.getFullYear().toString();
        return `${month} ${year}`;
    };


    // Function to capitalize the first letter of a string
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    if (loadError) {
        return (
            <StyledDashboardContainer>
                <Box display="flex" alignItems="center" gap={1.5} mb={2} role="status" aria-live="polite">
                    <CircularProgress size={28} thickness={4} sx={{ color: '#667eea' }} />
                    <Typography sx={{ color: '#4a5568', fontWeight: 500 }}>Loading survey metrics…</Typography>
                </Box>
                <StyledHeaderCard elevation={0}>
                    <CardContent>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            Survey Performance Analytics
                        </Typography>
                    </CardContent>
                </StyledHeaderCard>
                <Box
                    sx={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', textAlign: 'center', gap: 1.5, py: 8,
                    }}
                >
                    <AnalyticsIcon sx={{ fontSize: '3rem', color: '#e53e3e' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#e53e3e' }}>
                        Couldn't load survey metrics
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#718096', maxWidth: 420 }}>
                        Please refresh the page, or contact support if the problem persists.
                    </Typography>
                    <Box sx={{ mt: 1, p: 2, bgcolor: '#fed7d7', borderRadius: 2, maxWidth: 500 }}>
                        <Typography variant="caption" sx={{ color: '#c53030' }}>
                            Error details: {loadError}
                        </Typography>
                    </Box>
                </Box>
            </StyledDashboardContainer>
        );
    }

    // Skeleton rather than a bare line of text, so this page loads like the rest
    // of the admin dashboards do.
    if (!surveyMetrics) {
        return (
            <StyledDashboardContainer>
                <StyledHeaderCard elevation={0}>
                    <CardContent>
                        <Skeleton variant="text" width="40%" height={36} sx={{ bgcolor: 'rgba(255,255,255,0.25)' }} />
                        <Skeleton variant="text" width="55%" height={22} sx={{ bgcolor: 'rgba(255,255,255,0.15)' }} />
                    </CardContent>
                </StyledHeaderCard>
                <Grid container spacing={2}>
                    {Array.from({ length: 8 }, (_, i) => (
                        <Grid item xs={12} sm={6} lg={3} key={i}>
                            <Skeleton variant="rectangular" height={220} sx={{ borderRadius: '20px' }} />
                        </Grid>
                    ))}
                </Grid>
            </StyledDashboardContainer>
        );
    }

    // Prepare data from the API response
    const completionRateData = [
        { name: 'Completed', value: surveyMetrics.surveyCompletionRate },
        { name: 'Not Completed', value: surveyMetrics.dropOffRate }
    ];

    const surveyDistributionData = Object.entries(surveyMetrics.surveyDistribution).map(([key, value]) => ({
        name: key,
        value
    }));

    const surveyResponsesByRegionData = Object.entries(surveyMetrics.surveyResponsesByRegion).map(([key, value]) => ({
        name: key,
        value
    }));
    const sortedRegions = [...surveyResponsesByRegionData].sort((a, b) => b.value - a.value);
    const topThreeRegions = sortedRegions.slice(0, 3);

    const surveyResponsesByCountryData = Object.entries(surveyMetrics.surveyResponsesByCountry).map(([key, value]) => ({
        name: key,
        value
    }));
    const sortedResidence = [...surveyResponsesByCountryData].sort((a, b) => b.value - a.value);
    const topThreeResidence = sortedResidence.slice(0, 3);

    const surveyResponsesByAgeGroupData = Object.entries(surveyMetrics.surveyResponsesByAgeGroup).map(([key, value]) => ({
        name: key,
        value
    }));

    const sortedAgeGroup = [...surveyResponsesByAgeGroupData].sort((a, b) => b.value - a.value);
    const topThreeAgeGroup = sortedAgeGroup.slice(0, 3);

    const surveyResponsesByMonthData = Object.entries(surveyMetrics.surveyResponsesByMonth).map(([key, value]) => ({
        name: capitalizeFirstLetter(key),
        value
    }));

    // Function to export fetched data to Excel
    const exportToExcel = () => {
        const workbook = XLSX.utils.book_new();

        // Convert all key-value pairs to an array for the "Metadata" sheet
        const metadata = Object.entries(surveyMetrics).map(([key, value]) => {
            if (typeof value === 'object' && !Array.isArray(value)) {
                return [key, JSON.stringify(value)];
            }
            return [key, value];
        });
        metadata.unshift(['Key', 'Value']); // Add header row

        // Create metadata sheet
        const metadataSheet = XLSX.utils.aoa_to_sheet(metadata);
        metadataSheet['!cols'] = [{ width: 30 }, { width: 50 }];
        metadataSheet['A1'].s = { font: { bold: true }, fill: { fgColor: { rgb: 'D3D3D3' } } };
        metadataSheet['B1'].s = { font: { bold: true }, fill: { fgColor: { rgb: 'D3D3D3' } } };
        XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Metadata');

        // Helper function to create a styled sheet
        const createStyledSheet = (data, sheetName, headers) => {
            const sheet = XLSX.utils.json_to_sheet(data, { header: headers });
            sheet['!cols'] = headers.map(() => ({ width: 20 }));
            // Style headers
            headers.forEach((header, index) => {
                const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
                sheet[cellAddress].s = {
                    font: { bold: true },
                    fill: { fgColor: { rgb: 'E0E0E0' } }
                };
            });
            return sheet;
        };

        // Create sheets for each data set
        const distributionSheet = createStyledSheet(surveyDistributionData, 'Survey Distribution', [
            'Entrypoint',
            'Responses'
        ]);
        XLSX.utils.book_append_sheet(workbook, distributionSheet, 'Survey Distribution');

        const regionSheet = createStyledSheet(surveyResponsesByRegionData, 'Responses by Region', [
            'Region',
            'Responses'
        ]);
        XLSX.utils.book_append_sheet(workbook, regionSheet, 'Responses by Region');

        const ageGroupSheet = createStyledSheet(surveyResponsesByAgeGroupData, 'Responses by Age Group', [
            'Age Group',
            'Responses'
        ]);
        XLSX.utils.book_append_sheet(workbook, ageGroupSheet, 'Responses by Age Group');

        const monthSheet = createStyledSheet(surveyResponsesByMonthData, 'Responses by Month', [
            'Month',
            'Responses'
        ]);
        XLSX.utils.book_append_sheet(workbook, monthSheet, 'Responses by Month');

        // Save the workbook
        XLSX.writeFile(workbook, 'SurveyMetrics.xlsx');
    };

    return (
        <StyledThemeProvider theme={theme}>
            <StyledDashboardContainer>
                {/* Header Section */}
                <StyledHeaderCard elevation={0}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                            <Box flex={1}>
                                {/* Icon + text, matching the header treatment on every other
                                    admin page (the emoji was the only one of its kind). */}
                                <Typography
                                    variant="h5"
                                    sx={{ fontWeight: 700, mb: 0.5, display: 'flex', alignItems: 'center', gap: 1.5 }}
                                >
                                    <AnalyticsIcon sx={{ fontSize: 32 }} />
                                    Survey Performance Analytics
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 400, mb: 1 }}>
                                    Real-time insights and comprehensive survey metrics
                                </Typography>
                                <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
                                    <StyledChip label={`Updated: ${getCurrentTime()}`} size="small" />
                                    <StyledChip label={`Period: ${capitalizeFirstLetter(getCurrentMonth())}`} size="small" />
                                </Box>
                            </Box>
                            <Box>
                                <StyledExportButton
                                    variant="contained"
                                    startIcon={<FileDownloadIcon />}
                                    onClick={exportToExcel}
                                    size="medium"
                                >
                                    Export Analytics
                                </StyledExportButton>
                            </Box>
                        </Box>
                    </CardContent>
                </StyledHeaderCard>

                {/* Key Metrics Grid */}
                <Grid container spacing={2}>
                    {/* Total Surveys Completed */}
                    <Grid item xs={12} sm={6} lg={3}>
                        <StyledMetricCard gradient="linear-gradient(135deg, #4ade80 0%, #22c55e 100%)">
                            <CardContent>
                                <StyledMetricIcon color={theme.palette.success.main}>
                                    <CheckCircleIcon fontSize="inherit" />
                                </StyledMetricIcon>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1f2937' }}>
                                    Surveys Completed
                                </Typography>
                                <Typography variant="h4" sx={{ color: theme.palette.success.main, fontWeight: 700, mb: 1 }}>
                                    {surveyMetrics.totalSurveysCompleted}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                    out of {surveyMetrics.totalSurveys} total
                                </Typography>
                                {/* Dropped the per-card "Last updated" box: it printed the render
                                    time, not the data time, and the header already shows it. */}
                            </CardContent>
                        </StyledMetricCard>
                    </Grid>

                    {/* Survey Completion Rate */}
                    <Grid item xs={12} sm={6} lg={3}>
                        <StyledMetricCard gradient="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)">
                            <CardContent>
                                {/* The two chart cards were the only ones without an icon tile,
                                    so their titles sat higher than every neighbour in the row. */}
                                <StyledMetricIcon color="#3b82f6">
                                    <DonutLargeIcon fontSize="inherit" />
                                </StyledMetricIcon>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1f2937' }}>
                                    Completion Rate
                                </Typography>
                                {completionRateData[0]["value"] != null ? (
                                    <Box sx={{ width: '100%', height: 220 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={completionRateData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={40}
                                                    outerRadius={80}
                                                    dataKey="value"
                                                    label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                                                >
                                                    {completionRateData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={index === 0 ? '#22c55e' : '#ef4444'}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => [`${value}%`, 'Rate']} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Box>
                                ) : (
                                    <NoData />
                                )}
                            </CardContent>
                        </StyledMetricCard>
                    </Grid>

                    {/* Average Time to Complete */}
                    <Grid item xs={12} sm={6} lg={3}>
                        <StyledMetricCard gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
                            <CardContent>
                                <StyledMetricIcon color={theme.palette.warning.main}>
                                    <AccessTimeIcon fontSize="inherit" />
                                </StyledMetricIcon>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1f2937' }}>
                                    Avg. Completion Time
                                </Typography>
                                {surveyMetrics.averageTimeToComplete != null ? (
                                    <>
                                        <Typography variant="h4" sx={{ color: theme.palette.warning.main, fontWeight: 700, mb: 1 }}>
                                            {surveyMetrics.averageTimeToComplete}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                            minutes per survey
                                        </Typography>
                                    </>
                                ) : (
                                    <NoData />
                                )}
                            </CardContent>
                        </StyledMetricCard>
                    </Grid>

                    {/* Drop-off Rate */}
                    <Grid item xs={12} sm={6} lg={3}>
                        <StyledMetricCard gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)">
                            <CardContent>
                                <StyledMetricIcon color={theme.palette.error.main}>
                                    <CancelIcon fontSize="inherit" />
                                </StyledMetricIcon>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1f2937' }}>
                                    Drop-off Rate
                                </Typography>
                                {surveyMetrics.dropOffRate != null ? (
                                    <>
                                        <Typography variant="h4" sx={{ color: theme.palette.error.main, fontWeight: 700, mb: 1 }}>
                                            {surveyMetrics.dropOffRate}%
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                            incomplete surveys
                                        </Typography>
                                    </>
                                ) : (
                                    <NoData />
                                )}
                            </CardContent>
                        </StyledMetricCard>
                    </Grid>

                    {/* Survey Distribution */}
                    <Grid item xs={12} sm={6} lg={3}>
                        <StyledMetricCard 
                            gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                            onClick={handleDistributionOpen}
                            clickable
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleDistributionOpen(); } }}
                        >
                            <CardContent>
                                <StyledMetricIcon color="#8b5cf6">
                                    <PlaceIcon fontSize="inherit" />
                                </StyledMetricIcon>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1f2937' }}>
                                    Survey Distribution
                                </Typography>
                                {surveyDistributionData.length > 0 ? (
                                    <Box sx={{ width: '100%', height: 200 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={surveyDistributionData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={30}
                                                    outerRadius={70}
                                                    dataKey="value"
                                                >
                                                    {surveyDistributionData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][index % 6]}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Box>
                                ) : (
                                    <NoData />
                                )}
                                <Typography variant="caption" sx={{ color: '#6b7280', mt: 1 }}>
                                    Click to view details
                                </Typography>
                            </CardContent>
                        </StyledMetricCard>
                    </Grid>

                    {/* Survey Responses by Nationality */}
                    <Grid item xs={12} sm={6} lg={3}>
                        <StyledMetricCard
                            gradient="linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
                            onClick={handleNationalityOpen}
                            clickable
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleNationalityOpen(); } }}
                        >
                            <CardContent>
                                <StyledMetricIcon color="#06b6d4">
                                    <PublicIcon fontSize="inherit" />
                                </StyledMetricIcon>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1f2937' }}>
                                    Top Nationalities
                                </Typography>
                                {surveyResponsesByRegionData.length > 0 ? (
                                    <Box sx={{ width: '100%' }}>
                                        {topThreeRegions.slice(0, 3).map((region, index) => (
                                            <Box key={region.name} sx={{ mb: 1, p: 1, bgcolor: `rgba(6, 182, 212, ${0.1 + index * 0.05})`, borderRadius: '8px' }}>
                                                <Typography variant="body1" sx={{ fontWeight: index === 0 ? 700 : 500, color: '#1f2937' }}>
                                                    {index + 1}. {region.name}
                                                </Typography>
                                                <Typography variant="h6" sx={{ color: '#06b6d4', fontWeight: 600 }}>
                                                    {region.value} responses
                                                </Typography>
                                            </Box>
                                        ))}
                                        <Typography variant="caption" sx={{ color: '#6b7280', mt: 1 }}>
                                            Click to view all
                                        </Typography>
                                    </Box>
                                ) : (
                                    <NoData />
                                )}
                            </CardContent>
                        </StyledMetricCard>
                    </Grid>

                    {/* Survey Responses by Country of Residence */}
                    <Grid item xs={12} sm={6} lg={3}>
                        <StyledMetricCard
                            gradient="linear-gradient(135deg, #ec4899 0%, #db2777 100%)"
                            onClick={handleCountryOpen}
                            clickable
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCountryOpen(); } }}
                        >
                            <CardContent>
                                <StyledMetricIcon color="#ec4899">
                                    <PeopleIcon fontSize="inherit" />
                                </StyledMetricIcon>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1f2937' }}>
                                    Residence Countries
                                </Typography>
                                {sortedResidence.length > 0 ? (
                                    <Box sx={{ width: '100%' }}>
                                        {topThreeResidence.slice(0, 3).map((country, index) => (
                                            <Box key={country.name} sx={{ mb: 1, p: 1, bgcolor: `rgba(236, 72, 153, ${0.1 + index * 0.05})`, borderRadius: '8px' }}>
                                                <Typography variant="body1" sx={{ fontWeight: index === 0 ? 700 : 500, color: '#1f2937' }}>
                                                    {index + 1}. {country.name}
                                                </Typography>
                                                <Typography variant="h6" sx={{ color: '#ec4899', fontWeight: 600 }}>
                                                    {country.value} responses
                                                </Typography>
                                            </Box>
                                        ))}
                                        <Typography variant="caption" sx={{ color: '#6b7280', mt: 1 }}>
                                            Click to view all
                                        </Typography>
                                    </Box>
                                ) : (
                                    <NoData />
                                )}
                            </CardContent>
                        </StyledMetricCard>
                    </Grid>

                    {/* Survey Responses by Age Group */}
                    <Grid item xs={12} sm={6} lg={3}>
                        <StyledMetricCard
                            gradient="linear-gradient(135deg, #84cc16 0%, #65a30d 100%)"
                            onClick={handleAgeGroupOpen}
                            clickable
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleAgeGroupOpen(); } }}
                        >
                            <CardContent>
                                <StyledMetricIcon color="#84cc16">
                                    <GroupIcon fontSize="inherit" />
                                </StyledMetricIcon>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1f2937' }}>
                                    Top Age Groups
                                </Typography>
                                {sortedAgeGroup.length > 0 ? (
                                    <Box sx={{ width: '100%' }}>
                                        {topThreeAgeGroup.slice(0, 3).map((age, index) => (
                                            <Box key={age.name} sx={{ mb: 1, p: 1, bgcolor: `rgba(132, 204, 22, ${0.1 + index * 0.05})`, borderRadius: '8px' }}>
                                                <Typography variant="body1" sx={{ fontWeight: index === 0 ? 700 : 500, color: '#1f2937' }}>
                                                    {index + 1}. {age.name} years
                                                </Typography>
                                                <Typography variant="h6" sx={{ color: '#84cc16', fontWeight: 600 }}>
                                                    {age.value} responses
                                                </Typography>
                                            </Box>
                                        ))}
                                        <Typography variant="caption" sx={{ color: '#6b7280', mt: 1 }}>
                                            Click to view all
                                        </Typography>
                                    </Box>
                                ) : (
                                    <NoData />
                                )}
                            </CardContent>
                        </StyledMetricCard>
                    </Grid>

                    {/* Survey Responses by Month */}
                    <Grid item xs={12} sm={6} lg={3}>
                        <StyledMetricCard 
                            gradient="linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
                            onClick={handleOpen}
                            clickable
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen(); } }}
                        >
                            <CardContent>
                                <StyledMetricIcon color="#6366f1">
                                    <TrendingUpIcon fontSize="inherit" />
                                </StyledMetricIcon>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1f2937' }}>
                                    Monthly Trends
                                </Typography>
                                {surveyMetrics.surveyResponsesByMonth[capitalizeFirstLetter(getCurrentMonth())] != undefined ? (
                                    <>
                                        <Typography variant="h6" sx={{ color: '#1f2937', mb: 1 }}>
                                            {capitalizeFirstLetter(getCurrentMonth())}
                                        </Typography>
                                        <Typography variant="h4" sx={{ color: '#6366f1', fontWeight: 700, mb: 1 }}>
                                            {surveyMetrics.surveyResponsesByMonth[capitalizeFirstLetter(getCurrentMonth())]}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                            surveys this month
                                        </Typography>
                                    </>
                                ) : (
                                    <NoData />
                                )}
                                <Typography variant="caption" sx={{ color: '#6b7280', mt: 1 }}>
                                    Click to view trends
                                </Typography>
                            </CardContent>
                        </StyledMetricCard>
                    </Grid>
                </Grid>

                {/* Enhanced Modals */}
                
                {/* Monthly Trends Modal */}
                <StyledModal
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{ timeout: 500 }}
                >
                    <Fade in={open}>
                        <StyledModalContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
                                    📈 Monthly Response Trends
                                </Typography>
                                <IconButton onClick={handleClose} size="large">
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} lg={8}>
                                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '15px', mb: 2 }}>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                            Response Trend Analysis
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <AreaChart data={surveyResponsesByMonthData}>
                                                <defs>
                                                    <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip 
                                                    contentStyle={{
                                                        backgroundColor: 'white',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                                <Area 
                                                    type="monotone" 
                                                    dataKey="value" 
                                                    stroke="#6366f1" 
                                                    fillOpacity={1} 
                                                    fill="url(#colorArea)" 
                                                    strokeWidth={3}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} lg={4}>
                                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '15px' }}>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                            Monthly Breakdown
                                        </Typography>
                                        <StyledTableContainer component={Paper}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Month</TableCell>
                                                        <TableCell align="right">Responses</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {surveyResponsesByMonthData.map((row, index) => (
                                                        <TableRow key={row.name}>
                                                            <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                                                                {row.name}
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Chip 
                                                                    label={row.value} 
                                                                    color="primary" 
                                                                    variant="outlined"
                                                                    size="small"
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </StyledTableContainer>
                                    </Box>
                                </Grid>
                            </Grid>
                        </StyledModalContent>
                    </Fade>
                </StyledModal>

                {/* Survey Distribution Modal */}
                <StyledModal
                    open={openDistributionModal}
                    onClose={handleDistributionClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{ timeout: 500 }}
                >
                    <Fade in={openDistributionModal}>
                        <StyledModalContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
                                    📍 Survey Distribution Analysis
                                </Typography>
                                <IconButton onClick={handleDistributionClose} size="large">
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} lg={6}>
                                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '15px' }}>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                            Distribution Overview
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <PieChart>
                                                <Pie
                                                    data={surveyDistributionData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={140}
                                                    dataKey="value"
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                                >
                                                    {surveyDistributionData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][index % 6]}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip 
                                                    contentStyle={{
                                                        backgroundColor: 'white',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} lg={6}>
                                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '15px' }}>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                            Entry Point Details
                                        </Typography>
                                        <StyledTableContainer component={Paper}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Entry Point</TableCell>
                                                        <TableCell align="center">Responses</TableCell>
                                                        <TableCell align="center">Percentage</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {surveyDistributionData.map((row, index) => {
                                                        const total = surveyDistributionData.reduce((sum, item) => sum + item.value, 0);
                                                        const percentage = ((row.value / total) * 100).toFixed(1);
                                                        return (
                                                            <TableRow key={row.name}>
                                                                <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                                                                    {row.name}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <Chip 
                                                                        label={row.value} 
                                                                        color="primary" 
                                                                        variant="outlined"
                                                                        size="small"
                                                                    />
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <Chip 
                                                                        label={`${percentage}%`} 
                                                                        color="secondary" 
                                                                        size="small"
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </StyledTableContainer>
                                    </Box>
                                </Grid>
                            </Grid>
                        </StyledModalContent>
                    </Fade>
                </StyledModal>

                {/* Nationality Modal */}
                <StyledModal
                    open={openNationalityModal}
                    onClose={handleNationalityClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{ timeout: 500 }}
                >
                    <Fade in={openNationalityModal}>
                        <StyledModalContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
                                    🌍 Nationality Distribution
                                </Typography>
                                <IconButton onClick={handleNationalityClose} size="large">
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} lg={8}>
                                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '15px' }}>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                            Responses by Nationality
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={400}>
                                            {/* Sorted: a "top 10" chart built from an unsorted slice is
                                                just the first 10 keys the API returned. */}
                                            <BarChart data={sortedRegions.slice(0, 10)}>
                                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} />
                                                <YAxis />
                                                <Tooltip 
                                                    contentStyle={{
                                                        backgroundColor: 'white',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                                <Bar 
                                                    dataKey="value" 
                                                    fill="url(#nationalityGradient)"
                                                    radius={[4, 4, 0, 0]}
                                                />
                                                <defs>
                                                    <linearGradient id="nationalityGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                                    </linearGradient>
                                                </defs>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} lg={4}>
                                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '15px' }}>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                            Top Nationalities
                                        </Typography>
                                        <StyledTableContainer component={Paper} sx={{ maxHeight: 400 }}>
                                            <Table stickyHeader>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Nationality</TableCell>
                                                        <TableCell align="right">Count</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {/* Ranked list: must iterate the sorted array, or the
                                                        "1., 2., 3." chips and the highlight are applied to
                                                        whatever order the API happened to return. */}
                                                    {sortedRegions.map((row, index) => (
                                                        <TableRow key={row.name}>
                                                            <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                                                                <Box display="flex" alignItems="center">
                                                                    <Chip 
                                                                        label={index + 1} 
                                                                        size="small" 
                                                                        color={index < 3 ? "primary" : "default"}
                                                                        sx={{ mr: 1, minWidth: '32px' }}
                                                                    />
                                                                    {row.name}
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Chip 
                                                                    label={row.value} 
                                                                    color={index < 3 ? "primary" : "default"}
                                                                    variant={index < 3 ? "filled" : "outlined"}
                                                                    size="small"
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </StyledTableContainer>
                                    </Box>
                                </Grid>
                            </Grid>
                        </StyledModalContent>
                    </Fade>
                </StyledModal>

                {/* Country of Residence Modal */}
                <StyledModal
                    open={openCountryModal}
                    onClose={handleCountryClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{ timeout: 500 }}
                >
                    <Fade in={openCountryModal}>
                        <StyledModalContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
                                    🏠 Country of Residence Distribution
                                </Typography>
                                <IconButton onClick={handleCountryClose} size="large">
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} lg={8}>
                                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '15px' }}>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                            Responses by Country of Residence
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart data={sortedResidence.slice(0, 10)}>
                                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} />
                                                <YAxis />
                                                <Tooltip 
                                                    contentStyle={{
                                                        backgroundColor: 'white',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                                <Bar 
                                                    dataKey="value" 
                                                    fill="url(#countryGradient)"
                                                    radius={[4, 4, 0, 0]}
                                                />
                                                <defs>
                                                    <linearGradient id="countryGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0.3}/>
                                                    </linearGradient>
                                                </defs>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} lg={4}>
                                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '15px' }}>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                            Top Countries
                                        </Typography>
                                        <StyledTableContainer component={Paper} sx={{ maxHeight: 400 }}>
                                            <Table stickyHeader>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Country</TableCell>
                                                        <TableCell align="right">Count</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {sortedResidence.map((row, index) => (
                                                        <TableRow key={row.name}>
                                                            <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                                                                <Box display="flex" alignItems="center">
                                                                    <Chip 
                                                                        label={index + 1} 
                                                                        size="small" 
                                                                        color={index < 3 ? "secondary" : "default"}
                                                                        sx={{ mr: 1, minWidth: '32px' }}
                                                                    />
                                                                    {row.name}
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Chip 
                                                                    label={row.value} 
                                                                    color={index < 3 ? "secondary" : "default"}
                                                                    variant={index < 3 ? "filled" : "outlined"}
                                                                    size="small"
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </StyledTableContainer>
                                    </Box>
                                </Grid>
                            </Grid>
                        </StyledModalContent>
                    </Fade>
                </StyledModal>

                {/* Age Group Modal */}
                <StyledModal
                    open={openAgeGroupModal}
                    onClose={handleAgeGroupClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{ timeout: 500 }}
                >
                    <Fade in={openAgeGroupModal}>
                        <StyledModalContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
                                    👥 Age Group Distribution
                                </Typography>
                                <IconButton onClick={handleAgeGroupClose} size="large">
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} lg={8}>
                                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '15px' }}>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                            Responses by Age Group
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart data={surveyResponsesByAgeGroupData}>
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip 
                                                    contentStyle={{
                                                        backgroundColor: 'white',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                                <Bar 
                                                    dataKey="value" 
                                                    fill="url(#ageGradient)"
                                                    radius={[4, 4, 0, 0]}
                                                />
                                                <defs>
                                                    <linearGradient id="ageGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#84cc16" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#84cc16" stopOpacity={0.3}/>
                                                    </linearGradient>
                                                </defs>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} lg={4}>
                                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '15px' }}>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                            Age Group Summary
                                        </Typography>
                                        <StyledTableContainer component={Paper}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Age Group</TableCell>
                                                        <TableCell align="right">Responses</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {sortedAgeGroup.map((row, index) => (
                                                        <TableRow key={row.name}>
                                                            <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                                                                <Box display="flex" alignItems="center">
                                                                    <Chip 
                                                                        label={index + 1} 
                                                                        size="small" 
                                                                        color={index < 3 ? "success" : "default"}
                                                                        sx={{ mr: 1, minWidth: '32px' }}
                                                                    />
                                                                    {row.name} years
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Chip 
                                                                    label={row.value} 
                                                                    color={index < 3 ? "success" : "default"}
                                                                    variant={index < 3 ? "filled" : "outlined"}
                                                                    size="small"
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </StyledTableContainer>
                                    </Box>
                                </Grid>
                            </Grid>
                        </StyledModalContent>
                    </Fade>
                </StyledModal>

                </StyledDashboardContainer>
        </StyledThemeProvider>
    );
};

export default SurveyMetrics;
