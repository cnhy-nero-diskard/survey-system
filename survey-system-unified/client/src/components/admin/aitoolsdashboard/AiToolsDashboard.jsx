import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Box,
  CircularProgress,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Slide,
  Snackbar,
  Alert,
  TextField,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

// ----------------------------------
// NEW IMPORTS FOR DATE PICKERS
// ----------------------------------
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
// ----------------------------------

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AIToolsDashboard = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [topicText, setTopicText] = useState("");
  const [isTopicModeling, setIsTopicModeling] = useState(false);
  const [topicModelingResult, setTopicModelingResult] = useState(null);
  const [topicModelingError, setTopicModelingError] = useState(null);

  const [openEndedResponses, setOpenEndedResponses] = useState([]);
  const isActive = true;
  const createdAt = new Date();
  const isRecentlyCreated = (new Date() - new Date(createdAt)) < 5 * 60 * 1000;

  // State for API Configuration
  const [hfTokens, setHfTokens] = useState([]);
  const [selectedHFToken, setSelectedHFToken] = useState("");

  // State for Sentiment Analysis
  const [sentimentText, setSentimentText] = useState("");
  const [isSentimentAnalyzing, setIsSentimentAnalyzing] = useState(false);
  const [sentimentResults, setSentimentResults] = useState(null);
  const [sentimentError, setSentimentError] = useState(null);

  // State for Dialogs
  const [openMetricsDialog, setOpenMetricsDialog] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState(null);

  // State for Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  // Entity selection states
  const [selectedEntities, setSelectedEntities] = useState([]);
  const uniqueEntities = Array.from(
    new Map(
      openEndedResponses
        .map((response) => [response.entity, response]) // Use entity as the key
    ).values() // Get unique response objects
  ).map((response) => ({
    entity: response.entity,
    name: response.name,
  }));  const [uniqueDates, setUniqueDates] = useState(new Set());

  // State for API Usage Data
  const [apiUsageData, setApiUsageData] = useState({
    labels: ['Sentiment Analysis', 'Topic Modeling'],
    datasets: [
      {
        label: 'API Calls',
        data: [0, 0],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchHFTokens = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_HOST}/api/hf-tokens`,
          { withCredentials: true }
        );
        setHfTokens(response.data);
      } catch (error) {
        console.error('Error fetching HF tokens:', error);
      }
    };
    fetchHFTokens();
  }, []);

  // Whenever openEndedResponses is updated, recalculate uniqueDates
  useEffect(() => {
    const dateStrings = openEndedResponses
      .map((r) => (r.created_at ? r.created_at.split('T')[0] : undefined))
      .filter(Boolean);
    setUniqueDates(new Set(dateStrings));
  }, [openEndedResponses]);

  const handleScanOpenEndedResponses = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_HOST}/api/admin/survey-responses/open-ended`,
        {
          withCredentials: true,
        }
      );
      setOpenEndedResponses(response.data);
      console.log('Open-ended responses:', response.data);

      // Filter responses where is_analyzed is false
      const unanalyzedResponses = response.data.filter(
        (r) => !r.is_analyzed
      );

      if (unanalyzedResponses.length > 0) {
        // Concatenate all to one string
        const combinedText = unanalyzedResponses
          .map((r) => r.response_value)
          .join("\n\n");

        setSentimentText(combinedText);
        setTopicText(combinedText);
      } else {
        console.log("All responses have been analyzed.");
      }
    } catch (error) {
      console.error('Error fetching open-ended responses:', error);
    }
  };

  const handleSentimentAnalysis = async () => {
    setIsSentimentAnalyzing(true);
    setSentimentError(null);
    setSnackbarMessage(
      "Just a heads-up, the first response might take a little longer (20-30 seconds) if the AI endpoint was dormant."
    );
    setSnackbarSeverity("info");
    setSnackbarOpen(true);

    try {
      const selectedToken = hfTokens.find(
        (token) => token.id === selectedHFToken
      );
      if (!selectedToken) {
        throw new Error('No token selected');
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/api/analyzesentiment`,
        {
          text: sentimentText,
          tokenLabel: selectedToken.label,
        },
        { withCredentials: true }
      );

      if (response.data && Array.isArray(response.data)) {
        setSentimentResults(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        if (response.data?.error) {
          setSnackbarMessage("THE AI ENDPOINT IS CURRENTLY UNAVAILABLE. PLEASE TRY AGAIN LATER");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
        setSentimentResults(null);
      }

      setIsSentimentAnalyzing(false);
    } catch (error) {
      console.error('Error during sentiment analysis:', error);
      setSentimentError(error.message);
      setIsSentimentAnalyzing(false);
    }
  };

  const handleStoreSentimentResults = async () => {
    if (!sentimentResults) return;
    try {
      // Re-fetch or use existing openEndedResponses
      const openEndedResponsesResponse = await axios.get(
        `${process.env.REACT_APP_API_HOST}/api/admin/survey-responses/open-ended`,
        { withCredentials: true }
      );
      const openEnded = openEndedResponsesResponse.data;

      const resultsToStore = sentimentResults.map((result) => {
        const matchingResponse = openEnded.find((response) => {
          const normalizedRes = response.response_value.trim().toLowerCase();
          const normalizedSens = result.text.trim().toLowerCase();
          return (
            normalizedRes.includes(normalizedSens) ||
            normalizedSens.includes(normalizedRes)
          );
        });

        const userId = matchingResponse
          ? matchingResponse.anonymous_user_id
          : "default_user_id";

        const responseId = matchingResponse ? matchingResponse.response_id : null;
        const now = new Date();
        const timeString = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        return {
          user_id: userId,
          response_id: responseId,
          review_date: new Date().toISOString() + timeString,
          rating: "0",
          sqref: "TPENT",
          sentiment: result.sentiment,
          confidence: parseFloat(result.confidence).toFixed(3),
        };
      });

      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/api/admin/sentiment_results`,
        { results: resultsToStore },
        { withCredentials: true }
      );

      if (response.status === 201 || response.status === 204) {
        setSnackbarMessage("Sentiment analysis results stored successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("Failed to store sentiment analysis results.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }

      // Potentially do something with the anonymized user IDs
      console.log("Placeholder for admin/anonymous-users endpoint if needed.");
    } catch (error) {
      console.error('Error storing sentiment analysis results:', error);
      setSnackbarMessage("Error storing sentiment analysis results.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleRetrieveOpenEndedResponsesForTopicModeling = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_HOST}/api/admin/survey-responses/open-ended`,
        { withCredentials: true }
      );
      setOpenEndedResponses(response.data);

      // Filter by date range + selected entities
      const filteredResponses = response.data.filter((resp) => {
        const hasCreatedDate = resp.created_at != null;
        // If no startDate or endDate selected, skip date filtering
        let dateFilter = true;
        if (startDate && endDate && hasCreatedDate) {
          const createdDate = new Date(resp.created_at).getTime();
          const startTime = new Date(startDate).getTime();
          const endTime = new Date(endDate).getTime();
          dateFilter = createdDate >= startTime && createdDate <= endTime;
        }
        // Entity filter
        const entityFilter =
          selectedEntities.length === 0 ||
          selectedEntities.some((entity) => (resp.entity || []).includes(entity));

        return dateFilter && entityFilter;
      });

      const combinedText = filteredResponses
        .map((resp) => resp.response_value)
        .join("\n\n");

      if (combinedText) {
        setTopicText(combinedText);
      } else {
        setTopicText("");
        console.log("No open-ended responses found for the selected filters.");
      }
    } catch (error) {
      console.error('Error fetching open-ended responses:', error);
    }
  };

  const handleTopicModeling = async () => {
    setIsTopicModeling(true);
    setTopicModelingError(null);
    setSnackbarMessage(
      "Starting Topic Modeling. This may take a moment if the endpoint is initializing."
    );
    setSnackbarSeverity("info");
    setSnackbarOpen(true);

    try {
      const selectedToken = hfTokens.find(
        (token) => token.id === selectedHFToken
      );
      if (!selectedToken) {
        throw new Error('No token selected');
      }
      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/api/analyzetopics`,
        {
          text: topicText,
          tokenLabel: selectedToken.label,
        },
        { withCredentials: true }
      );

      setTopicModelingResult(response.data);

      if (response.data.hasOwnProperty("error")) {
        setSnackbarMessage("THE AI ENDPOINT IS CURRENTLY UNAVAILABLE. PLEASE TRY AGAIN LATER");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error during topic modeling:', error);
      setTopicModelingError(error.message);
    } finally {
      setIsTopicModeling(false);
    }
  };

  // ---------------------------------------------
  // UPDATED: send "customFilter" along with result
  // ---------------------------------------------
  const handleStoreTopicModelingResult = async () => {
    if (!topicModelingResult) return;
    try {
      let zeroidx = topicModelingResult[0] || {};
      zeroidx = {
        ...zeroidx,
        startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : '2020-01-01',
        endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        customFilter: selectedEntities, // <--- Selected entities are included here
      };
  
      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/api/storetopics`,
        { zeroidx },
        { withCredentials: true }
      );
  
      if (response.status === 201 || response.status === 200) {
        setSnackbarMessage("Topic modeling results stored successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        throw new Error('Failed to store topic modeling results');
      }
    } catch (error) {
      console.error('Error storing topic modeling results:', error);
      setSnackbarMessage("Error storing topic modeling results.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleOpenMetricsDialog = (metrics) => {
    setSelectedMetrics(metrics);
    setOpenMetricsDialog(true);
  };

  const handleCloseMetricsDialog = () => {
    setOpenMetricsDialog(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container
      style={{ minHeight: '100vh' }}
      maxWidth="lg"
      sx={{ mt: 4, mb: 4, backgroundColor: 'rgba(0, 0, 0, 0)' }}
    >
      <Fade in timeout={1000}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'primary.main' }}
        >
          AI Tools Dashboard
        </Typography>
      </Fade>

      <Grid container spacing={3}>
        {/* API Configuration Section */}
        <Grid item xs={12}>
          <Slide in direction="up" timeout={1000}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 'medium', color: 'text.primary' }}
              >
                API Configuration
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: 'text.secondary', mb: 1 }}
                >
                  API Token Manager
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Select
                    fullWidth
                    value={selectedHFToken}
                    onChange={(e) => setSelectedHFToken(e.target.value)}
                    sx={{ mb: 2 }}
                    aria-label="Select API Token"
                  >
                    {hfTokens.map((token) => (
                      <MenuItem key={token.id} value={token.id}>
                        {token.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Box>
            </Paper>
          </Slide>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleScanOpenEndedResponses}
            sx={{ textTransform: 'none', mt: 2 }}
          >
            SCAN FOR OPEN-ENDED RESPONSES
          </Button>
        </Grid>

        {/* Sentiment Analysis */}
        <Grid item xs={12} md={6}>
          <Slide in direction="up" timeout={1200}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 'medium', color: 'text.primary' }}
              >
                Sentiment Analysis
              </Typography>
              <Box>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                  Enter text for sentiment analysis.
                </Typography>
                <TextField
                  value={sentimentText}
                  onChange={(e) => setSentimentText(e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSentimentAnalysis}
                  disabled={
                    isSentimentAnalyzing || !sentimentText || !selectedHFToken
                  }
                  sx={{ textTransform: 'none' }}
                >
                  {isSentimentAnalyzing ? (
                    <CircularProgress size={24} />
                  ) : (
                    'ANALYZE SENTIMENT'
                  )}
                </Button>
                {isSentimentAnalyzing && <CircularProgress sx={{ ml: 2 }} />}
              </Box>
              {sentimentResults && (
                <Box
                  sx={{
                    mt: 2,
                    maxHeight: '400px',
                    overflowY: 'auto',
                    pr: 2,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ color: 'text.secondary', fontWeight: 'bold', mb: 2 }}
                  >
                    Sentiment Analysis Results:
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {sentimentResults.map((result, index) => (
                      <Paper
                        key={index}
                        elevation={2}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'background.paper',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary', fontWeight: 'medium' }}
                          >
                            {result.text}
                          </Typography>
                          <Chip
                            label={result.sentiment.toUpperCase()}
                            color={
                              result.sentiment === 'positive'
                                ? 'success'
                                : result.sentiment === 'negative'
                                  ? 'error'
                                  : 'warning'
                            }
                            size="small"
                          />
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Confidence: <strong>{result.confidence.toFixed(2)}%</strong>
                          </Typography>
                        </Box>
                      </Paper>
                    ))}
                  </Box>

                  {/* Quick Summary */}
                  <Box sx={{ mt: 3 }}>
                    <Typography
                      variant="body1"
                      sx={{ color: 'text.secondary', fontWeight: 'bold', mb: 1 }}
                    >
                      Sentiment Summary:
                    </Typography>
                    {(() => {
                      // Calculate sentiment counts
                      const sentimentCounts = sentimentResults.reduce(
                        (acc, res) => {
                          acc[res.sentiment] = (acc[res.sentiment] || 0) + 1;
                          return acc;
                        },
                        { positive: 0, neutral: 0, negative: 0 }
                      );
                      const total = sentimentResults.length;
                      const positiveRatio = sentimentCounts.positive / total;
                      const negativeRatio = sentimentCounts.negative / total;
                      const neutralRatio = sentimentCounts.neutral / total;

                      let averageSentiment = 'neutral';
                      if (positiveRatio > negativeRatio && positiveRatio > neutralRatio) {
                        averageSentiment = 'positive';
                      } else if (
                        negativeRatio > positiveRatio &&
                        negativeRatio > neutralRatio
                      ) {
                        averageSentiment = 'negative';
                      }

                      // Calculate average confidence
                      const totalConfidence = sentimentResults.reduce(
                        (sum, item) => sum + parseFloat(item.confidence),
                        0
                      );
                      const avgConfidence = totalConfidence / total;

                      return (
                        <>
                          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Chip
                              label={`POSITIVE (${sentimentCounts.positive})`}
                              color="success"
                              variant="outlined"
                            />
                            <Chip
                              label={`NEGATIVE (${sentimentCounts.negative})`}
                              color="error"
                              variant="outlined"
                            />
                            <Chip
                              label={`NEUTRAL (${sentimentCounts.neutral})`}
                              color="warning"
                              variant="outlined"
                            />
                          </Box>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Average Sentiment: <strong>{averageSentiment.toUpperCase()}</strong>
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Average Confidence: <strong>{avgConfidence.toFixed(2)}%</strong>
                          </Typography>
                        </>
                      );
                    })()}
                  </Box>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleStoreSentimentResults}
                    sx={{ mt: 2, textTransform: 'none' }}
                  >
                    Store Results to Database
                  </Button>
                </Box>
              )}
              {sentimentError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {sentimentError}
                </Alert>
              )}
            </Paper>
          </Slide>
        </Grid>

        {/* Topic Modeling Section */}
        <Grid item xs={12} md={6}>
          <Slide in direction="up" timeout={1400}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 2,
                background:
                  'linear-gradient(to right, #f0f0f0, #fafafa)',
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 'medium',
                  color: 'text.primary',
                  mb: 2,
                }}
              >
                Topic Modeling
              </Typography>

              {/* Filter Section */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: 2,
                  backgroundColor: '#fff',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 'bold',
                    mb: 2,
                  }}
                >
                  Date Range & Entity Filters
                </Typography>

                {/* 
                  UPDATED: Using MUI DatePicker to disable invalid dates 
                  based on openEndedResponses
                */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={(newVal) => setStartDate(newVal)}
                      renderInput={(params) => (
                        <TextField fullWidth {...params} />
                      )}
                      shouldDisableDate={(date) => {
                        const dateString = dayjs(date).format('YYYY-MM-DD');
                        // Grey out if date is not in uniqueDates set
                        return !uniqueDates.has(dateString);
                      }}
                    />

                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={(newVal) => setEndDate(newVal)}
                      renderInput={(params) => (
                        <TextField fullWidth {...params} />
                      )}
                      shouldDisableDate={(date) => {
                        const dateString = dayjs(date).format('YYYY-MM-DD');
                        return !uniqueDates.has(dateString);
                      }}
                    />
                  </Box>
                </LocalizationProvider>

                <Box sx={{ mb: 2 }}>
  <Typography
    variant="subtitle2"
    sx={{ color: 'text.secondary', mb: 1 }}
  >
    Filter by Entity
  </Typography>
  <Select
    fullWidth
    multiple
    value={selectedEntities}
    onChange={(e) => setSelectedEntities(e.target.value)}
    renderValue={(selected) => selected.join(', ')}
  >
    {uniqueEntities.map((entityObj) => {
      console.log(entityObj);
      const displayLabel = `[${entityObj.name}] - [${entityObj.entity}]`;
      return (
        <MenuItem key={entityObj.entity} value={entityObj.entity}>
          {displayLabel}
        </MenuItem>
      );
    })}
  </Select>
</Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRetrieveOpenEndedResponsesForTopicModeling}
                  sx={{ textTransform: 'none' }}
                >
                  Retrieve & Filter Responses
                </Button>
              </Paper>

              {/* Topic Modeling Section */}
              <Box>
                <Typography
                  variant="body1"
                  sx={{ color: 'text.secondary', mb: 2 }}
                >
                  Below is the auto-populated text from filtered open-ended
                  responses. Feel free to edit it before analysis.
                </Typography>
                <TextField
                  value={topicText}
                  onChange={(e) => setTopicText(e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleTopicModeling}
                  disabled={isTopicModeling || !topicText || !selectedHFToken}
                  sx={{ textTransform: 'none' }}
                >
                  {isTopicModeling ? (
                    <CircularProgress size={24} />
                  ) : (
                    'Analyze Topics'
                  )}
                </Button>
                {isTopicModeling && <CircularProgress sx={{ ml: 2 }} />}
              </Box>

              {topicModelingResult && (
                <Box
                  sx={{ mt: 2, maxHeight: '400px', overflowY: 'auto', pr: 2 }}
                >
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Topic Modeling Results:
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {topicModelingResult.map((topic, index) => (
                      <Box key={index} sx={{ mb: 3 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                          }}
                        >
                          Topic {index + 1}: {topic.customLabel}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Probability: {(topic.probability * 100).toFixed(2)}%
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Top Words:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {topic.top_words.map((word, wordIndex) => (
                              <Chip key={wordIndex} label={word} variant="outlined" />
                            ))}
                          </Box>
                        </Box>

                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Contributions:
                          </Typography>
                          <List>
                            {topic.contribution.map((contrib, contribIndex) => (
                              <ListItem key={contribIndex}>
                                <ListItemText
                                  primary={`${contrib[1]}: ${contrib[2]}`}
                                  secondary={`Topic ${contrib[0]}`}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleStoreTopicModelingResult}
                    sx={{ mt: 2, textTransform: 'none' }}
                  >
                    Store Results to Database
                  </Button>
                </Box>
              )}
              {topicModelingError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {topicModelingError}
                </Alert>
              )}
            </Paper>
          </Slide>
        </Grid>
      </Grid>

      {/* Metrics Dialog */}
      <Dialog open={openMetricsDialog} onClose={handleCloseMetricsDialog}>
        <DialogTitle>API Call Metrics</DialogTitle>
        <DialogContent>
          {selectedMetrics && (
            <Bar
              data={{
                labels: ['Sentiment Analysis', 'Topic Modeling'],
                datasets: [
                  {
                    label: 'API Calls',
                    data: [
                      selectedMetrics.sentiment,
                      selectedMetrics.topicModeling,
                    ],
                    backgroundColor: [
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                    ],
                    borderColor: [
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMetricsDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%', fontSize: '1.1rem' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AIToolsDashboard;