import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Paper,
  Grid,
  Box,
  CircularProgress,
  Select,
  MenuItem,
  Fade,
  Slide,
  Snackbar,
  Alert,
  TextField,
  Chip,
  Tooltip,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  ApiRounded as AiToolsIcon,
  VpnKeyRounded as TokenIcon,
  SearchRounded as ScanIcon,
  SentimentSatisfiedRounded as SentimentIcon,
  TopicRounded as TopicIcon,
  CloudUploadRounded as StoreIcon,
  CheckCircleRounded as CheckIcon,
  InfoRounded as InfoIcon,
  DatasetRounded as DatasetIcon,
  AutoGraphRounded as AutoGraphIcon,
  TuneRounded as TuneIcon,
} from '@mui/icons-material';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { fontFamily } from '../../../config/fontConfig';
import {
  gradients,
  brand,
  text,
  surface,
  shadow,
  radius,
  sentimentPalette,
} from '../shared/designTokens';

// ----------------------------------
// DATE PICKERS
// ----------------------------------
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
// ----------------------------------

// ---- Shared section cards & controls (match the rest of the admin app) ----
// Glassmorphism + top accent rule + hover lift, mirroring UsersDashboard's
// GlassCard and Dashboard's CardContainer so this page no longer looks like
// the odd one out.
const SectionCard = styled(Paper)`
  background: ${surface.card} !important;
  backdrop-filter: blur(10px);
  border: ${surface.cardBorder};
  border-radius: ${radius.card} !important;
  box-shadow: ${shadow.card} !important;
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: ${gradients.brandBar};
  }
  &:hover {
    box-shadow: ${shadow.cardHover} !important;
    transform: translateY(-2px);
  }
`;

const SectionHeader = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const IconTile = styled(Box)`
  width: 44px;
  height: 44px;
  border-radius: ${radius.control};
  background: ${gradients.brand};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
  & svg { font-size: 22px; }
`;

const SectionTitle = styled(Typography)`
  font-family: ${fontFamily};
  font-weight: 600;
  font-size: 18px;
  color: ${text.heading};
  line-height: 1.2;
`;

const SectionSubtitle = styled(Typography)`
  font-family: ${fontFamily};
  font-size: 13px;
  color: ${text.muted};
`;

const PrimaryButton = styled(Button)`
  background: ${gradients.brand} !important;
  color: #fff !important;
  text-transform: none !important;
  font-family: ${fontFamily};
  font-weight: 500;
  padding: 8px 20px !important;
  border-radius: ${radius.control} !important;
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.35) !important;
  transition: all 0.25s ease;
  &:hover {
    background: ${gradients.brandHover} !important;
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.45) !important;
  }
  &.Mui-disabled {
    background: ${gradients.brand} !important;
    color: rgba(255, 255, 255, 0.55) !important;
    box-shadow: none !important;
  }
`;

// Workflow stepper that surfaces the Configure -> Scan -> Analyze -> Store flow.
const StepStrip = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 4px;
`;

const StepItem = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StepBadge = styled(Box)`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${fontFamily};
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
  background: ${({ $active }) => ($active ? gradients.brand : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : text.muted)};
  border: ${({ $active }) => ($active ? 'none' : `2px solid ${surface.divider}`)};
  box-shadow: ${({ $active }) => ($active ? '0 4px 12px rgba(102, 126, 234, 0.4)' : '0 1px 3px rgba(0,0,0,0.06)')};
  & svg { font-size: 18px; }
`;

const StepConnector = styled(Box)`
  flex: 1;
  min-width: 24px;
  max-width: 60px;
  height: 2px;
  background: ${({ $done }) => ($done ? gradients.brandBar : surface.divider)};
  margin: 0 10px;
`;

// Stacked proportion bar for the sentiment summary (uses sentimentPalette so it
// agrees with the rest of the app's idea of what "positive" looks like).
const SentimentBar = styled(Box)`
  display: flex;
  height: 14px;
  border-radius: ${radius.pill};
  overflow: hidden;
  background: ${surface.divider};
`;

const SentimentResultCard = styled(Paper).withConfig({
  shouldForwardProp: (prop) => !['$accent'].includes(prop),
})`
  border-left: 5px solid ${({ $accent }) => $accent};
  border-radius: ${radius.control} !important;
  padding: 14px 16px;
  background: #fff !important;
  box-shadow: ${shadow.soft} !important;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  &:hover { box-shadow: ${shadow.card} !important; transform: translateY(-1px); }
`;

const TopicResultCard = styled(Paper)`
  border-radius: ${radius.control} !important;
  padding: 18px 18px 16px;
  background: #fff !important;
  box-shadow: ${shadow.soft} !important;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  &:hover { box-shadow: ${shadow.card} !important; transform: translateY(-1px); }
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: ${gradients.brandBar};
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const PageShell = styled(Box)`
  background: ${gradients.page};
  min-height: 100vh;
  padding: 32px;
  font-family: ${fontFamily};
  animation: ${fadeIn} 0.6s ease-out;
  box-sizing: border-box;
`;

const HeaderContainer = styled(Box)`
  background: ${gradients.brand};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  color: white;
`;

const HeaderTitle = styled(Typography)`
  font-family: ${fontFamily};
  font-weight: 600;
  font-size: 28px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AIToolsDashboard = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [topicText, setTopicText] = useState("");
  const [isTopicModeling, setIsTopicModeling] = useState(false);
  const [topicModelingResult, setTopicModelingResult] = useState(null);
  const [topicModelingError, setTopicModelingError] = useState(null);

  const [openEndedResponses, setOpenEndedResponses] = useState([]);

  // State for API Configuration
  const [hfTokens, setHfTokens] = useState([]);
  const [selectedHFToken, setSelectedHFToken] = useState("");

  // State for Sentiment Analysis
  const [sentimentText, setSentimentText] = useState("");
  const [isSentimentAnalyzing, setIsSentimentAnalyzing] = useState(false);
  const [sentimentResults, setSentimentResults] = useState(null);
  const [sentimentError, setSentimentError] = useState(null);

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
  }));

  const [uniqueDates, setUniqueDates] = useState(new Set());

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

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const stepsDone = {
    configured: Boolean(selectedHFToken),
    scanned: openEndedResponses.length > 0,
    analyzed: Boolean(sentimentResults) || Boolean(topicModelingResult),
  };
  const stepList = [
    { n: 1, label: 'Configure', done: stepsDone.configured },
    { n: 2, label: 'Scan Responses', done: stepsDone.scanned },
    { n: 3, label: 'Analyze', done: stepsDone.analyzed },
    { n: 4, label: 'Store Results', done: false },
  ];

  return (
    <PageShell>
      <Fade in timeout={600}>
        <HeaderContainer>
          <HeaderTitle>
            <AiToolsIcon sx={{ fontSize: 32 }} />
            AI Tools Dashboard
          </HeaderTitle>
          <Typography variant="subtitle1" sx={{ fontFamily, opacity: 0.9, fontWeight: 400, mt: 0.5 }}>
            Sentiment analysis and topic modelling over open-ended survey responses
          </Typography>
        </HeaderContainer>
      </Fade>

      {/* Workflow steps */}
      <StepStrip>
        {stepList.map((step, i) => (
          <React.Fragment key={step.n}>
            <StepItem>
              <StepBadge $active={step.done}>
                {step.done ? <CheckIcon /> : step.n}
              </StepBadge>
              <Typography sx={{ fontFamily, fontWeight: 500, fontSize: 14, color: step.done ? text.heading : text.muted }}>
                {step.label}
              </Typography>
            </StepItem>
            {i < stepList.length - 1 && <StepConnector $done={step.done} />}
          </React.Fragment>
        ))}
      </StepStrip>

      <Grid container spacing={3}>
        {/* API Configuration */}
        <Grid item xs={12} md={6}>
          <Slide in direction="up" timeout={1000}>
            <SectionCard elevation={0}>
              <SectionHeader>
                <IconTile><TokenIcon /></IconTile>
                <Box>
                  <SectionTitle>API Configuration</SectionTitle>
                  <SectionSubtitle>Select a Hugging Face token to power the models</SectionSubtitle>
                </Box>
              </SectionHeader>
              <Typography sx={{ fontFamily, fontSize: 14, color: text.muted, mb: 1 }}>
                API Token Manager
              </Typography>
              <Select
                fullWidth
                displayEmpty
                value={selectedHFToken}
                onChange={(e) => setSelectedHFToken(e.target.value)}
                sx={{ mb: 1 }}
                aria-label="Select API Token"
                renderValue={(value) =>
                  hfTokens.find((t) => t.id === value)?.label || 'Select an API token to enable analysis'
                }
              >
                {hfTokens.length === 0 && (
                  <MenuItem disabled value="">No API tokens available</MenuItem>
                )}
                {hfTokens.map((token) => (
                  <MenuItem key={token.id} value={token.id}>{token.label}</MenuItem>
                ))}
              </Select>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1 }}>
                {selectedHFToken ? (
                  <>
                    <CheckIcon sx={{ color: sentimentPalette.positive, fontSize: 18 }} />
                    <Typography variant="body2" sx={{ fontFamily, color: text.body }}>
                      Token selected — analysis tools are enabled
                    </Typography>
                  </>
                ) : (
                  <>
                    <InfoIcon sx={{ color: text.muted, fontSize: 18 }} />
                    <Typography variant="body2" sx={{ fontFamily, color: text.muted }}>
                      Choose a token to unlock sentiment and topic analysis
                    </Typography>
                  </>
                )}
              </Box>
            </SectionCard>
          </Slide>
        </Grid>

        {/* Data Source — scan for open-ended responses */}
        <Grid item xs={12} md={6}>
          <Slide in direction="up" timeout={1100}>
            <SectionCard elevation={0}>
              <SectionHeader>
                <IconTile><ScanIcon /></IconTile>
                <Box>
                  <SectionTitle>Open-Ended Responses</SectionTitle>
                  <SectionSubtitle>Scan the database for responses to analyse</SectionSubtitle>
                </Box>
              </SectionHeader>
              <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
                <Box sx={{ flex: 1, background: surface.divider, borderRadius: radius.control, p: 1.5 }}>
                  <Typography sx={{ fontFamily, fontWeight: 700, fontSize: 24, color: brand.primary, lineHeight: 1.1 }}>
                    {openEndedResponses.length}
                  </Typography>
                  <Typography sx={{ fontFamily, fontSize: 12, color: text.muted }}>
                    responses scanned
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, background: surface.divider, borderRadius: radius.control, p: 1.5 }}>
                  <Typography sx={{ fontFamily, fontWeight: 700, fontSize: 24, color: brand.secondary, lineHeight: 1.1 }}>
                    {uniqueEntities.length}
                  </Typography>
                  <Typography sx={{ fontFamily, fontSize: 12, color: text.muted }}>
                    entities available
                  </Typography>
                </Box>
              </Box>
              <PrimaryButton onClick={handleScanOpenEndedResponses} startIcon={<ScanIcon />}>
                Scan for Open-Ended Responses
              </PrimaryButton>
            </SectionCard>
          </Slide>
        </Grid>

        {/* Sentiment Analysis */}
        <Grid item xs={12} md={6}>
          <Slide in direction="up" timeout={1200}>
            <SectionCard elevation={0}>
              <SectionHeader>
                <IconTile><SentimentIcon /></IconTile>
                <Box>
                  <SectionTitle>Sentiment Analysis</SectionTitle>
                  <SectionSubtitle>Gauge the emotional tone of free-text responses</SectionSubtitle>
                </Box>
              </SectionHeader>
              <Typography sx={{ fontFamily, fontSize: 14, color: text.muted, mb: 1.5 }}>
                Paste or type text to classify as positive, neutral or negative.
              </Typography>
              <TextField
                value={sentimentText}
                onChange={(e) => setSentimentText(e.target.value)}
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                placeholder="Enter text for sentiment analysis…"
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: radius.control } }}
              />
              <PrimaryButton
                onClick={handleSentimentAnalysis}
                disabled={isSentimentAnalyzing || !sentimentText || !selectedHFToken}
                startIcon={isSentimentAnalyzing ? <CircularProgress size={18} color="inherit" /> : <AutoGraphIcon />}
              >
                {isSentimentAnalyzing ? 'Analyzing…' : 'Analyze Sentiment'}
              </PrimaryButton>

              {sentimentResults && sentimentResults.length > 0 && (
                <Box sx={{ mt: 3, maxHeight: '420px', overflowY: 'auto', pr: 1 }}>
                  <Typography sx={{ fontFamily, fontWeight: 600, fontSize: 15, color: text.heading, mb: 1.5 }}>
                    Results
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {sentimentResults.map((result, index) => {
                      const tone = result.sentiment;
                      const accent = sentimentPalette[tone] || text.muted;
                      return (
                        <SentimentResultCard key={index} $accent={accent} elevation={0}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                            <Typography sx={{ fontFamily, color: text.body, fontSize: 14, lineHeight: 1.4 }}>
                              {result.text}
                            </Typography>
                            <Chip
                              label={tone.toUpperCase()}
                              size="small"
                              sx={{
                                flexShrink: 0,
                                bgcolor: accent,
                                color: '#fff',
                                fontWeight: 600,
                                fontFamily,
                                textTransform: 'capitalize',
                              }}
                            />
                          </Box>
                          <Box sx={{ mt: 1.25 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                              <Typography sx={{ fontFamily, fontSize: 12, color: text.muted }}>Confidence</Typography>
                              <Typography sx={{ fontFamily, fontSize: 12, fontWeight: 600, color: text.body }}>
                                {result.confidence.toFixed(2)}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(parseFloat(result.confidence) || 0, 100)}
                              sx={{
                                height: 6,
                                borderRadius: radius.pill,
                                bgcolor: surface.divider,
                                '& .MuiLinearProgress-bar': { background: accent, borderRadius: radius.pill },
                              }}
                            />
                          </Box>
                        </SentimentResultCard>
                      );
                    })}
                  </Box>

                  {/* Summary */}
                  <Box sx={{ mt: 3 }}>
                    <Typography sx={{ fontFamily, fontWeight: 600, fontSize: 15, color: text.heading, mb: 1.5 }}>
                      Summary
                    </Typography>
                    {(() => {
                      const sentimentCounts = sentimentResults.reduce(
                        (acc, res) => { acc[res.sentiment] = (acc[res.sentiment] || 0) + 1; return acc; },
                        { positive: 0, neutral: 0, negative: 0 }
                      );
                      const total = sentimentResults.length;
                      let averageSentiment = 'neutral';
                      if (sentimentCounts.positive > sentimentCounts.negative && sentimentCounts.positive > sentimentCounts.neutral) {
                        averageSentiment = 'positive';
                      } else if (sentimentCounts.negative > sentimentCounts.positive && sentimentCounts.negative > sentimentCounts.neutral) {
                        averageSentiment = 'negative';
                      }
                      const totalConfidence = sentimentResults.reduce((sum, item) => sum + parseFloat(item.confidence), 0);
                      const avgConfidence = totalConfidence / total;
                      const segments = [
                        { key: 'positive', count: sentimentCounts.positive, color: sentimentPalette.positive },
                        { key: 'neutral', count: sentimentCounts.neutral, color: sentimentPalette.neutral },
                        { key: 'negative', count: sentimentCounts.negative, color: sentimentPalette.negative },
                      ];
                      return (
                        <>
                          <SentimentBar>
                            {segments.map((s) => s.count > 0 && (
                              <Tooltip key={s.key} title={`${s.key} — ${s.count} (${((s.count / total) * 100).toFixed(1)}%)`} arrow>
                                <Box sx={{ width: `${(s.count / total) * 100}%`, background: s.color, height: '100%' }} />
                              </Tooltip>
                            ))}
                          </SentimentBar>
                          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1.5, mb: 1.5 }}>
                            {segments.map((s) => (
                              <Box key={s.key} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                <Box sx={{ width: 12, height: 12, borderRadius: '3px', background: s.color }} />
                                <Typography sx={{ fontFamily, fontSize: 13, color: text.body, textTransform: 'capitalize' }}>
                                  {s.key} · {s.count}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                            <Typography sx={{ fontFamily, fontSize: 13, color: text.muted }}>
                              Average sentiment:{' '}
                              <strong style={{ color: sentimentPalette[averageSentiment], textTransform: 'capitalize' }}>
                                {averageSentiment}
                              </strong>
                            </Typography>
                            <Typography sx={{ fontFamily, fontSize: 13, color: text.muted }}>
                              Avg. confidence:{' '}
                              <strong style={{ color: text.heading }}>{avgConfidence.toFixed(2)}%</strong>
                            </Typography>
                          </Box>
                        </>
                      );
                    })()}
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <PrimaryButton onClick={handleStoreSentimentResults} startIcon={<StoreIcon />}>
                    Store Results to Database
                  </PrimaryButton>
                </Box>
              )}
              {sentimentError && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: radius.control, fontFamily }}>
                  {sentimentError}
                </Alert>
              )}
            </SectionCard>
          </Slide>
        </Grid>

        {/* Topic Modeling */}
        <Grid item xs={12} md={6}>
          <Slide in direction="up" timeout={1400}>
            <SectionCard elevation={0}>
              <SectionHeader>
                <IconTile><TopicIcon /></IconTile>
                <Box>
                  <SectionTitle>Topic Modeling</SectionTitle>
                  <SectionSubtitle>Discover recurring themes across responses</SectionSubtitle>
                </Box>
              </SectionHeader>

              {/* Filter panel */}
              <Paper
                variant="outlined"
                sx={{ p: 2, mb: 3, borderRadius: radius.control, borderColor: surface.divider, backgroundColor: '#fafbff' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TuneIcon sx={{ color: brand.primary, fontSize: 20 }} />
                  <Typography sx={{ fontFamily, fontWeight: 600, fontSize: 15, color: text.heading }}>
                    Date Range &amp; Entity Filters
                  </Typography>
                </Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={(newVal) => setStartDate(newVal)}
                      maxDate={endDate || undefined}
                      slotProps={{ textField: { fullWidth: true } }}
                      shouldDisableDate={(date) => {
                        const dateString = dayjs(date).format('YYYY-MM-DD');
                        return !uniqueDates.has(dateString);
                      }}
                    />
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={(newVal) => setEndDate(newVal)}
                      minDate={startDate || undefined}
                      slotProps={{ textField: { fullWidth: true } }}
                      shouldDisableDate={(date) => {
                        const dateString = dayjs(date).format('YYYY-MM-DD');
                        return !uniqueDates.has(dateString);
                      }}
                    />
                  </Box>
                </LocalizationProvider>
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontFamily, fontSize: 13, color: text.muted, mb: 1 }}>
                    Filter by Entity
                  </Typography>
                  <Select
                    fullWidth
                    multiple
                    displayEmpty
                    value={selectedEntities}
                    onChange={(e) => setSelectedEntities(e.target.value)}
                    renderValue={(selected) =>
                      selected.length === 0 ? 'All entities' : selected.join(', ')
                    }
                  >
                    {uniqueEntities.length === 0 && (
                      <MenuItem disabled value="">Scan for open-ended responses first</MenuItem>
                    )}
                    {uniqueEntities.map((entityObj) => (
                      <MenuItem key={entityObj.entity} value={entityObj.entity}>
                        {`${entityObj.name} — ${entityObj.entity}`}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <PrimaryButton onClick={handleRetrieveOpenEndedResponsesForTopicModeling} startIcon={<DatasetIcon />}>
                  Retrieve &amp; Filter Responses
                </PrimaryButton>
              </Paper>

              {/* Topic text + analyze */}
              <Box>
                <Typography sx={{ fontFamily, fontSize: 14, color: text.muted, mb: 1.5 }}>
                  Below is the auto-populated text from filtered open-ended responses. Feel free to edit it before analysis.
                </Typography>
                <TextField
                  value={topicText}
                  onChange={(e) => setTopicText(e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  placeholder="Filtered open-ended responses will appear here…"
                  sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: radius.control } }}
                />
                <PrimaryButton
                  onClick={handleTopicModeling}
                  disabled={isTopicModeling || !topicText || !selectedHFToken}
                  startIcon={isTopicModeling ? <CircularProgress size={18} color="inherit" /> : <TopicIcon />}
                >
                  {isTopicModeling ? 'Analyzing…' : 'Analyze Topics'}
                </PrimaryButton>
              </Box>

              {topicModelingResult && (
                <Box sx={{ mt: 3, maxHeight: '420px', overflowY: 'auto', pr: 1 }}>
                  <Typography sx={{ fontFamily, fontWeight: 600, fontSize: 15, color: text.heading, mb: 1.5 }}>
                    Topic Modeling Results
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {topicModelingResult.map((topic, index) => {
                      const prob = topic.probability * 100;
                      return (
                        <TopicResultCard key={index} elevation={0}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography sx={{ fontFamily, fontWeight: 700, fontSize: 16, color: text.heading }}>
                              Topic {index + 1}: {topic.customLabel}
                            </Typography>
                            <Chip
                              label={`${prob.toFixed(2)}%`}
                              size="small"
                              sx={{ bgcolor: gradients.brand, color: '#fff', fontWeight: 600, fontFamily }}
                            />
                          </Box>
                          <Box sx={{ mb: 1.5 }}>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(prob, 100)}
                              sx={{
                                height: 6,
                                borderRadius: radius.pill,
                                bgcolor: surface.divider,
                                '& .MuiLinearProgress-bar': { background: gradients.brandBar, borderRadius: radius.pill },
                              }}
                            />
                          </Box>
                          <Typography sx={{ fontFamily, fontSize: 13, color: text.muted, mb: 0.5 }}>
                            Top words
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                            {topic.top_words.map((word, wordIndex) => (
                              <Chip
                                key={wordIndex}
                                label={word}
                                size="small"
                                sx={{ fontFamily, bgcolor: 'rgba(102, 126, 234, 0.12)', color: brand.primaryDark, fontWeight: 500 }}
                              />
                            ))}
                          </Box>
                          {topic.contribution && topic.contribution.length > 0 && (
                            <Box>
                              <Typography sx={{ fontFamily, fontSize: 13, color: text.muted, mb: 0.5 }}>
                                Contributions
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                                {topic.contribution.map((contrib, contribIndex) => (
                                  <Box key={contribIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip
                                      label={`T${contrib[0]}`}
                                      size="small"
                                      sx={{ height: 20, fontFamily, fontSize: 11, bgcolor: surface.divider, color: text.muted }}
                                    />
                                    <Typography sx={{ fontFamily, fontSize: 13, color: text.body }}>
                                      {contrib[1]}:{' '}
                                      <strong style={{ color: text.heading }}>{contrib[2]}</strong>
                                    </Typography>
                                  </Box>
                                ))}
                              </Box>
                            </Box>
                          )}
                        </TopicResultCard>
                      );
                    })}
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <PrimaryButton onClick={handleStoreTopicModelingResult} startIcon={<StoreIcon />}>
                    Store Results to Database
                  </PrimaryButton>
                </Box>
              )}
              {topicModelingError && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: radius.control, fontFamily }}>
                  {topicModelingError}
                </Alert>
              )}
            </SectionCard>
          </Slide>
        </Grid>
      </Grid>

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
          sx={{ width: '100%', borderRadius: radius.control, fontFamily }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageShell>
  );
};

export default AIToolsDashboard;