import React, { useEffect, useState, useCallback, useMemo, useLayoutEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Chip,
  Skeleton,
  CircularProgress,
  Alert,
  Pagination,
  Card,
  CardContent,
  Grid,
  Fade,
  Slide,
  IconButton,
  useTheme,
  alpha,
  LinearProgress,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  Search as SearchIcon,
  BarChart as BarChartIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  PieChart as PieChartIcon,
  Category as CategoryIcon,
  ViewStream as ViewStreamIcon,
  ViewModule as ViewModuleIcon,
  ViewComfy as ViewComfyIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { useDebounce } from '../../../hooks/usePerformance';
import { fontFamily } from '../../../config/fontConfig';
import {
  brand,
  gradients,
  text,
  surface,
  shadow,
  radius,
  categoricalPalette
} from '../shared/designTokens';

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
    transform: translateX(-30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

// Styled Components
const Container = styled(Box)`
  padding: 24px;
  min-height: 100vh;
  background: ${gradients.page};
  font-family: ${fontFamily};
  box-sizing: border-box;
  animation: ${fadeIn} 0.6s ease-out;
`;

const HeaderSection = styled(Paper)`
  background: ${gradients.brand};
  color: white;
  padding: 32px;
  border-radius: 20px;
  margin-bottom: 24px;
  box-shadow: 0 10px 30px ${brand.primary}4d;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
    opacity: 0.1;
  }
`;

const StatsGrid = styled(Grid)`
  margin-bottom: 24px;
`;

const StatCard = styled(Card).withConfig({
  // accentColor is styling-only; keep it off the DOM node (MUI would otherwise
  // spread it onto the root div and React would warn).
  shouldForwardProp: (prop) => prop !== 'accentColor',
})`
  /* MUI's Paper/Card set background-color via an emotion class on the same
     element; target MuiPaper-root directly so our surface always wins the
     cascade regardless of style-tag injection order. */
  &.MuiPaper-root {
    background: ${surface.card};
    background-color: ${surface.card};
  }
  height: 100%;
  border-radius: ${radius.card};
  box-shadow: ${shadow.card};
  border: ${surface.cardBorder};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${shadow.cardHover};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.accentColor || brand.primary};
  }
`;

const SearchContainer = styled(Paper)`
  padding: 20px;
  border-radius: ${radius.card};
  margin-bottom: 24px;
  background: ${surface.card};
  backdrop-filter: blur(10px);
  border: ${surface.cardBorder};
  box-shadow: ${shadow.soft};
`;

const ChartContainer = styled(Card)`
  border-radius: ${radius.card};
  overflow: hidden;
  background: ${surface.card};
  backdrop-filter: blur(10px);
  border: ${surface.cardBorder};
  box-shadow: ${shadow.soft};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${slideIn} 0.5s ease-out;
  animation-fill-mode: both;
  /* Equalise card heights within a grid row so a multi-column layout looks
     tidy. The grid stretches each item; fill that height and let CardContent
     grow so shorter cards don't collapse. */
  height: 100%;
  display: flex;
  flex-direction: column;

  & .MuiCardContent-root {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadow.cardHover};
  }
`;

const LoadingCard = styled(Card)`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 400% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  border-radius: ${radius.card};
  /* Stretch within a grid track (refetch skeletons) but keep a sensible
     min height when stacked in the first-load skeleton. */
  height: 100%;
  min-height: 180px;
`;

// Accent icon tile for the redesigned overview stat cards.
const StatIconTile = styled(Box).withConfig({
  shouldForwardProp: (prop) => prop !== 'accent',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  margin-bottom: 12px;
  color: #ffffff;
  background: ${props => props.accent || brand.primary};
  box-shadow: 0 6px 16px ${props => `${props.accent || brand.primary}55`};
`;

// Accent colours for the four overview cards. Pulled from the shared palettes
// in designTokens (brand purple + categorical/sentiment tones) so the cards
// stay consistent with the rest of the admin dashboards.
const ACCENT = {
  questions: brand.primary,
  responses: '#06B6D4',
  average: '#8B5CF6',
  coverage: '#10B981',
};

// Stable per-division accent so each category badge keeps its colour across
// renders and pages. Derived from the shared categorical palette.
const divisionColor = (name) =>
  categoricalPalette[
    (String(name || '').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) %
      categoricalPalette.length
  ];

// Division badge shown on each question card.
const DivisionBadge = styled(Box).withConfig({
  shouldForwardProp: (prop) => prop !== 'accent',
})`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: ${radius.pill};
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: ${props => props.accent || brand.primary};
  background: ${props => `${props.accent || brand.primary}1a`};
  border: 1px solid ${props => `${props.accent || brand.primary}33`};
`;

// One row of the categorized tally breakdown (response option -> count/percent).
const TallyRow = styled(Box)`
  display: grid;
  grid-template-columns: minmax(110px, 190px) 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 5px 0;
`;

const TallyBarTrack = styled(Box)`
  position: relative;
  height: 8px;
  border-radius: ${radius.pill};
  background: ${surface.divider};
  overflow: hidden;
`;

const TallyBarFill = styled(Box).withConfig({
  shouldForwardProp: (prop) => !['fill', 'barColor'].includes(prop),
})`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${props => props.fill || '0%'};
  background: ${props => props.barColor || brand.primary};
  border-radius: ${radius.pill};
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ResultsCount = styled(Typography)`
  color: ${text.muted};
  font-size: 0.85rem;
  font-weight: 500;
`;

// Layout selector options and the page size each column count fetches. A
// denser grid fetches more items per page so the screen is actually filled
// instead of paging after the same 8 items regardless of columns.
const LAYOUT_COLUMN_OPTIONS = [1, 2, 3, 4];
const PAGE_SIZE_BY_COLUMNS = { 1: 8, 2: 8, 3: 12, 4: 16 };
const LAYOUT_STORAGE_KEY = 'surveyTally.layoutColumns';

// Read the persisted column preference. Falls back to 2 columns on any error
// or invalid value. Called lazily from useState's initializer (not at import).
const readStoredColumns = () => {
  try {
    const raw = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
    const parsed = raw ? parseInt(raw, 10) : NaN;
    return LAYOUT_COLUMN_OPTIONS.includes(parsed) ? parsed : 2;
  } catch {
    return 2;
  }
};

// Grid wrapper for the question cards. `columns` drives how many cards sit
// side by side so the page width is used instead of one tall column. Falls
// back to fewer columns on narrow screens so cards never get cramped.
const QuestionGrid = styled(Box).withConfig({
  shouldForwardProp: (prop) => prop !== 'columns',
})`
  display: grid;
  gap: 16px;
  align-items: stretch;
  grid-template-columns: repeat(${({ columns }) => columns}, minmax(0, 1fr));

  @media (max-width: 1280px) {
    grid-template-columns: repeat(${({ columns }) => Math.min(columns, 2)}, minmax(0, 1fr));
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SurveyTally = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [expandedCards, setExpandedCards] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  // Distinguishes the very first fetch (full-page skeleton) from later
  // search/pagination fetches, which must not unmount the search field —
  // doing so steals focus mid-typing.
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  // Layout selector: how many question cards sit side by side. Persisted so
  // the user's preferred density survives reloads. Defaults to 2 columns.
  const [layoutColumns, setLayoutColumns] = useState(readStoredColumns);
  // Page size scales with the column count so a denser layout fills the
  // screen instead of paging after a fixed number of items.
  const itemsPerPage = PAGE_SIZE_BY_COLUMNS[layoutColumns] ?? 8;

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Route changes in the admin SPA preserve the document scroll position.
  // Reset it on entry so the statistics header is never clipped above the viewport.
  useLayoutEffect(() => {
    // Set both scroll roots because the host shell can make either the
    // document or body the active scrolling element.
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);

  const fetchData = useCallback(async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `${process.env.REACT_APP_API_HOST}/api/admin/getAllByTallyPaginated`,
        {
          params: {
            page,
            limit: itemsPerPage,
            search
          },
          withCredentials: true
        }
      );
      
      const transformedData = transformData(response.data.data);
      setData(transformedData);
      setTotalPages(response.data.pagination.totalPages);
      setTotalCount(response.data.pagination.totalCount);
      setCurrentPage(response.data.pagination.currentPage);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
      setHasLoadedOnce(true);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchData(currentPage, debouncedSearchQuery);
  }, [fetchData, currentPage, debouncedSearchQuery]);

  // Reset page when search query changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchQuery]);

  // Search handling
  const handleSearchChange = useCallback((event) => {
    const value = event.target.value;
    setSearchQuery(value);
  }, []);

  // Page change handler
  const handlePageChange = useCallback((event, page) => {
    setCurrentPage(page);
    // Smooth scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Refresh data
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData(currentPage, debouncedSearchQuery);
    } finally {
      setRefreshing(false);
    }
  }, [fetchData, currentPage, debouncedSearchQuery]);

  // Toggle card expansion
  const toggleCardExpansion = useCallback((index) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  }, []);

  // Layout (columns) selector handler. A column change also changes the page
  // size, so reset to page 1 (the new size may have fewer pages) and clear any
  // per-card expansion state, since the visible card indices change.
  const handleLayoutChange = useCallback((_, columns) => {
    if (!LAYOUT_COLUMN_OPTIONS.includes(columns)) return;
    setLayoutColumns(columns);
    setExpandedCards({});
    setCurrentPage(1);
    try {
      window.localStorage.setItem(LAYOUT_STORAGE_KEY, String(columns));
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, []);

  /**
   * transformData: Enhanced version with additional metadata
   */
  const transformData = useCallback((data) => {
    return data.map((item, index) => {
      const row = { 
        name: `${item.division} - ${item.question}`,
        shortName: item.division,
        question: item.question,
        surveyquestion_ref: item.surveyquestion_ref,
        totalResponses: item.totalResponses || 0
      };

      // Convert 'occurrences' object into key-value pairs
      for (const [key, value] of Object.entries(item.occurrences)) {
        row[key] = parseInt(value, 10) || 0;
      }

      // Determine if all values are zero (i.e., no data)
      const isEmpty = Object.values(item.occurrences).every(
        (val) => parseInt(val, 10) === 0
      );

      // Calculate response distribution for pie chart data
      const pieData = Object.entries(item.occurrences).map(([key, value], idx) => ({
        name: key,
        value: parseInt(value, 10) || 0,
        color: categoricalPalette[idx % categoricalPalette.length]
      })).filter(item => item.value > 0);

      return {
        ...row,
        isEmpty,
        pieData,
        index
      };
    });
  }, []);

  // Per-question response options are derived from each group's own `pieData`
  // (built in transformData), so a global key set is no longer needed. The old
  // global memo made Yes/No questions render empty VerySatisfied/Satisfied
  // bars and a cluttered legend that didn't belong to the question.

  // Statistics calculations
  const stats = useMemo(() => {
    const totalResponses = data.reduce((sum, item) => sum + (item.totalResponses || 0), 0);
    const avgResponsesPerQuestion = data.length > 0 ? Math.round(totalResponses / data.length) : 0;
    const questionsWithData = data.filter(item => !item.isEmpty).length;
    
    return {
      totalQuestions: totalCount,
      questionsWithData,
      totalResponses,
      avgResponsesPerQuestion,
      completionRate: totalCount > 0 ? Math.round((questionsWithData / totalCount) * 100) : 0
    };
  }, [data, totalCount]);

  // Full-page skeleton, first load only.
  if (loading && !hasLoadedOnce) {
    return (
      <Container>
        <Box display="flex" alignItems="center" gap={1.5} mb={2} role="status" aria-live="polite">
          <CircularProgress size={28} thickness={4} sx={{ color: brand.primary }} />
          <Typography sx={{ color: text.body, fontWeight: 500 }}>Loading survey statistics…</Typography>
        </Box>
        <HeaderSection>
          <Skeleton variant="text" width="60%" height={40} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
          <Skeleton variant="text" width="40%" height={24} sx={{ bgcolor: 'rgba(255,255,255,0.1)', mt: 1 }} />
        </HeaderSection>
        <SearchContainer>
          <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
        </SearchContainer>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3].map((i) => (
            <LoadingCard key={i} />
          ))}
        </Box>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container>
        <Alert 
          severity="error" 
          action={
            <IconButton color="inherit" size="small" onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          }
          sx={{ borderRadius: 2 }}
        >
          <Typography variant="h6">Error loading survey statistics</Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header Section */}
      <Fade in timeout={600}>
        <HeaderSection elevation={0}>
          <Box display="flex" alignItems="center" mb={2}>
            <AssessmentIcon sx={{ fontSize: 32, mr: 2 }} />
            <Box>
              {/* Sized to match the 28px page titles used by the other admin routes. */}
              <Typography variant="h4" fontWeight={600} sx={{ fontSize: 28 }} gutterBottom>
                Survey Statistics Dashboard
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Comprehensive analysis of survey response patterns and distributions
              </Typography>
            </Box>
          </Box>
        </HeaderSection>
      </Fade>

      {/* Statistics Overview */}
      <Fade in timeout={800}>
        <StatsGrid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard accentColor={ACCENT.questions}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <StatIconTile accent={ACCENT.questions}>
                  <BarChartIcon fontSize="small" />
                </StatIconTile>
                <Typography variant="h4" sx={{ fontWeight: 700, color: text.heading, lineHeight: 1.1 }}>
                  {stats.totalQuestions}
                </Typography>
                <Typography variant="body2" sx={{ color: text.muted, mt: 0.5 }}>
                  Total Questions
                </Typography>
              </CardContent>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard accentColor={ACCENT.responses}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <StatIconTile accent={ACCENT.responses}>
                  <TrendingUpIcon fontSize="small" />
                </StatIconTile>
                <Typography variant="h4" sx={{ fontWeight: 700, color: text.heading, lineHeight: 1.1 }}>
                  {stats.totalResponses.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: text.muted, mt: 0.5 }}>
                  Total Responses
                </Typography>
              </CardContent>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard accentColor={ACCENT.average}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <StatIconTile accent={ACCENT.average}>
                  <PieChartIcon fontSize="small" />
                </StatIconTile>
                <Typography variant="h4" sx={{ fontWeight: 700, color: text.heading, lineHeight: 1.1 }}>
                  {stats.avgResponsesPerQuestion}
                </Typography>
                <Typography variant="body2" sx={{ color: text.muted, mt: 0.5 }}>
                  Avg. per Question
                </Typography>
              </CardContent>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard accentColor={ACCENT.coverage}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <StatIconTile accent={ACCENT.coverage}>
                  <AssessmentIcon fontSize="small" />
                </StatIconTile>
                <Typography variant="h4" sx={{ fontWeight: 700, color: text.heading, lineHeight: 1.1 }}>
                  {stats.completionRate}%
                </Typography>
                <Typography variant="body2" sx={{ color: text.muted, mt: 0.5 }}>
                  Data Coverage
                </Typography>
              </CardContent>
            </StatCard>
          </Grid>
        </StatsGrid>
      </Fade>

      {/* Search and Controls */}
      <Fade in timeout={1000}>
        <SearchContainer elevation={0}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto auto',
              gap: 2,
              alignItems: 'center'
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search questions or divisions..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: text.subtle }} />
                  </InputAdornment>
                ),
                sx: {
                  minHeight: 48,
                  borderRadius: 3,
                  backgroundColor: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.15)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: brand.primary
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: brand.primary,
                    borderWidth: 2
                  }
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
              <Typography
                variant="caption"
                sx={{
                  color: text.muted,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Layout
              </Typography>
              <ToggleButtonGroup
                exclusive
                size="small"
                value={layoutColumns}
                onChange={handleLayoutChange}
                disabled={loading}
                aria-label="Question card layout columns"
                sx={{
                  '& .MuiToggleButtonGroup-grouped': {
                    border: `1px solid ${surface.divider}`,
                    px: 1,
                    py: 0.5,
                    color: text.muted,
                    '&.Mui-selected': {
                      color: '#fff',
                      bgcolor: brand.primary,
                      borderColor: brand.primary,
                      '&:hover': { bgcolor: brand.primaryDark }
                    },
                    '&:not(:first-of-type)': {
                      borderLeft: `1px solid ${surface.divider}`
                    }
                  }
                }}
              >
                <ToggleButton value={1} aria-label="1 column"><ViewStreamIcon fontSize="small" /></ToggleButton>
                <ToggleButton value={2} aria-label="2 columns"><ViewModuleIcon fontSize="small" /></ToggleButton>
                <ToggleButton value={3} aria-label="3 columns"><ViewComfyIcon fontSize="small" /></ToggleButton>
                <ToggleButton value={4} aria-label="4 columns"><DashboardIcon fontSize="small" /></ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <IconButton
              onClick={handleRefresh}
              disabled={refreshing}
              aria-label="Refresh survey statistics"
              sx={{
                width: 48,
                height: 48,
                flexShrink: 0,
                color: brand.primary,
                bgcolor: alpha(brand.primary, 0.1),
                '&:hover': { bgcolor: alpha(brand.primary, 0.2) }
              }}
            >
              <RefreshIcon
                sx={{
                  animation: refreshing ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }}
              />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5, flexWrap: 'wrap', gap: 1 }}>
            <Box>
              {searchQuery && (
                <Chip
                  label={`Search: "${searchQuery}"`}
                  onDelete={() => setSearchQuery('')}
                  variant="outlined"
                  sx={{ color: brand.primary, borderColor: alpha(brand.primary, 0.4), fontWeight: 500 }}
                />
              )}
            </Box>
            {!loading && data.length > 0 && (
              <ResultsCount>
                Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} questions
              </ResultsCount>
            )}
          </Box>
          {loading && (
            <Box mt={2}>
              <LinearProgress
                sx={{
                  borderRadius: 1,
                  '& .MuiLinearProgress-bar': {
                    background: gradients.brandBar
                  }
                }}
              />
            </Box>
          )}
        </SearchContainer>
      </Fade>

      {/* Survey Data Charts */}
      <Box>
        {loading ? (
          // Refetch (search / page change): swap only the result list so the
          // header, stats and search field keep their state and focus. The
          // skeletons mirror the active column layout so the grid doesn't
          // collapse to a single column while the next page loads.
          <QuestionGrid columns={layoutColumns}>
            {Array.from({ length: Math.max(3, Math.min(itemsPerPage, layoutColumns * 3)) }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </QuestionGrid>
        ) : data.length === 0 ? (
          <Fade in timeout={1200}>
            <Alert severity="info" sx={{ borderRadius: 2, mb: 3 }}>
              <Typography variant="h6">No Data Available</Typography>
              <Typography variant="body2">
                {searchQuery 
                  ? `No results found for "${searchQuery}". Try adjusting your search terms.`
                  : 'No survey statistics are available at the moment.'
                }
              </Typography>
            </Alert>
          </Fade>
        ) : (
          <QuestionGrid columns={layoutColumns}>
            {data.map((group, index) => {
            const isExpanded = !!expandedCards[index];
            const segments = group.pieData || [];
            const visibleSegments = isExpanded ? segments : segments.slice(0, 3);
            const hiddenCount = segments.length - visibleSegments.length;
            const divisionAccent = divisionColor(group.shortName);
            return (
            <Slide
              in
              timeout={300 + index * 100}
              direction="up"
              key={group.surveyquestion_ref || index}
            >
              <ChartContainer>
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <DivisionBadge accent={divisionAccent}>
                        <CategoryIcon sx={{ fontSize: 14 }} />
                        {group.shortName}
                      </DivisionBadge>
                      <Typography
                        variant="body1"
                        sx={{
                          mt: 1,
                          color: text.heading,
                          fontWeight: 600,
                          display: '-webkit-box',
                          WebkitLineClamp: isExpanded ? 'none' : 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {group.question}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                      <Chip
                        label={`${group.totalResponses || 0} responses`}
                        size="small"
                        variant="outlined"
                        sx={{ color: brand.primary, borderColor: alpha(brand.primary, 0.4), fontWeight: 600 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => toggleCardExpansion(index)}
                        aria-label={isExpanded ? 'Collapse question details' : 'Expand question details'}
                        aria-expanded={isExpanded}
                        sx={{ color: text.muted }}
                      >
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                  </Box>

                    {group.isEmpty ? (
                      <Alert severity="warning" sx={{ borderRadius: 2 }}>
                        <Typography variant="body2">No response data available for this question</Typography>
                      </Alert>
                    ) : (
                      <>
                        <Box sx={{ width: '100%', height: 64 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[group]}
                              layout="vertical"
                              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                              maxBarSize={32}
                            >
                              <XAxis type="number" hide />
                              <YAxis type="category" dataKey="shortName" hide />
                              <Tooltip
                                cursor={{ fill: alpha(theme.palette.text.primary, 0.04) }}
                                contentStyle={{
                                  backgroundColor: theme.palette.background.paper,
                                  border: `1px solid ${theme.palette.divider}`,
                                  borderRadius: theme.shape.borderRadius,
                                  boxShadow: theme.shadows[4],
                                  fontSize: '0.85rem'
                                }}
                                formatter={(value, name) => [`${value} responses`, name]}
                              />
                              {segments.map((entry) => (
                                <Bar
                                  key={entry.name}
                                  dataKey={entry.name}
                                  stackId="responses"
                                  fill={entry.color}
                                />
                              ))}
                            </BarChart>
                          </ResponsiveContainer>
                        </Box>

                        <Box sx={{ mt: 1.5 }}>
                          {visibleSegments.map((entry) => {
                            const pct = group.totalResponses > 0 ? (entry.value / group.totalResponses) * 100 : 0;
                            return (
                              <TallyRow key={entry.name}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, bgcolor: entry.color }} />
                                  <Typography variant="body2" noWrap sx={{ color: text.body, fontWeight: 500 }}>
                                    {entry.name}
                                  </Typography>
                                </Box>
                                <TallyBarTrack>
                                  <TallyBarFill fill={`${pct}%`} barColor={entry.color} />
                                </TallyBarTrack>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, justifyContent: 'flex-end' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 700, color: text.heading }}>{entry.value}</Typography>
                                  <Typography variant="caption" sx={{ color: text.muted }}>{pct.toFixed(1)}%</Typography>
                                </Box>
                              </TallyRow>
                            );
                          })}
                          {hiddenCount > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.5 }}>
                              <Typography variant="caption" sx={{ color: text.muted }}>
                                +{hiddenCount} more option{hiddenCount > 1 ? 's' : ''} — expand to see all
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </>
                    )}
                </CardContent>
              </ChartContainer>
            </Slide>
            );
          })}
          </QuestionGrid>
        )}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Fade in timeout={1400}>
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPagination-ul': {
                  bgcolor: surface.card,
                  borderRadius: 3,
                  p: 1,
                  boxShadow: theme.shadows[2]
                }
              }}
            />
          </Box>
        </Fade>
      )}
    </Container>
  );
};

export default SurveyTally;
