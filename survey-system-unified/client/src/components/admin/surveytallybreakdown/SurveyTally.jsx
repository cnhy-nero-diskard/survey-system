import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
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
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  BarChart as BarChartIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  PieChart as PieChartIcon
} from '@mui/icons-material';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { useDebounce } from '../../../hooks/usePerformance';

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
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  animation: ${fadeIn} 0.6s ease-out;
`;

const HeaderSection = styled(Paper)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 32px;
  border-radius: 20px;
  margin-bottom: 24px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
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
  // Keep the styling-only props off the DOM node (MUI spreads unknown props
  // onto the root div, which makes React warn about them).
  shouldForwardProp: (prop) => !['gradient', 'accentColor'].includes(prop),
})`
  /* The gradient prop already carries a full linear-gradient(...) value —
     don't wrap it in a second one or the declaration is invalid and the card
     falls back to Paper white, leaving white text on a white card. */
  background: ${props => props.gradient || 'linear-gradient(135deg, #ffffff, #f8fafc)'};
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.accentColor || '#667eea'};
  }
`;

const SearchContainer = styled(Paper)`
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const ChartContainer = styled(Card)`
  margin-bottom: 16px;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  animation: ${slideIn} 0.5s ease-out;
  animation-fill-mode: both;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const LoadingCard = styled(Card)`
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 400% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  border-radius: 16px;
  height: 200px;
  margin-bottom: 16px;
`;

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'];

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
  const itemsPerPage = 8;

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

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
        color: COLORS[idx % COLORS.length]
      })).filter(item => item.value > 0);

      return {
        ...row,
        isEmpty,
        pieData,
        index
      };
    });
  }, []);

  /**
   * getUniqueKeys: Enhanced to get all unique response types
   */
  const uniqueKeys = useMemo(() => {
    const keys = new Set();
    data.forEach((group) => {
      Object.keys(group).forEach((key) => {
        if (!['name', 'isEmpty', 'shortName', 'question', 'surveyquestion_ref', 'totalResponses', 'pieData', 'index'].includes(key)) {
          keys.add(key);
        }
      });
    });
    return Array.from(keys);
  }, [data]);

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
        {[1, 2, 3].map((i) => (
          <LoadingCard key={i} />
        ))}
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
            <StatCard gradient="linear-gradient(135deg, #667eea, #764ba2)" accentColor="#667eea">
              <CardContent sx={{ textAlign: 'center', color: 'white' }}>
                <BarChartIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalQuestions}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Questions
                </Typography>
              </CardContent>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard gradient="linear-gradient(135deg, #f093fb, #f5576c)" accentColor="#f093fb">
              <CardContent sx={{ textAlign: 'center', color: 'white' }}>
                <TrendingUpIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalResponses.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Responses
                </Typography>
              </CardContent>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard gradient="linear-gradient(135deg, #4facfe, #00f2fe)" accentColor="#4facfe">
              <CardContent sx={{ textAlign: 'center', color: 'white' }}>
                <PieChartIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {stats.avgResponsesPerQuestion}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Avg. per Question
                </Typography>
              </CardContent>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard gradient="linear-gradient(135deg, #43e97b, #38f9d7)" accentColor="#43e97b">
              <CardContent sx={{ textAlign: 'center', color: 'white' }}>
                <AssessmentIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {stats.completionRate}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
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
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search questions or divisions..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: { borderRadius: 3 }
              }}
            />
            <IconButton 
              onClick={handleRefresh} 
              disabled={refreshing}
              color="primary" 
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
              }}
            >
              <RefreshIcon sx={{ 
                animation: refreshing ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }} />
            </IconButton>
          </Box>
          {searchQuery && (
            <Box mt={2}>
              <Chip 
                label={`Search: "${searchQuery}"`} 
                onDelete={() => setSearchQuery('')}
                color="primary"
                variant="outlined"
              />
            </Box>
          )}
          {loading && (
            <Box mt={2}>
              <LinearProgress
                sx={{ 
                  borderRadius: 1,
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(45deg, #667eea, #764ba2)'
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
          // header, stats and search field keep their state and focus.
          <>
            {[1, 2, 3].map((i) => <LoadingCard key={i} />)}
          </>
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
          data.map((group, index) => (
            <Slide 
              in 
              timeout={300 + index * 100} 
              direction="up" 
              key={group.surveyquestion_ref || index}
            >
              <ChartContainer>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                        {group.shortName}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: expandedCards[index] ? 'none' : 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {group.question}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip 
                        label={`${group.totalResponses || 0} responses`}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                      <IconButton
                        size="small"
                        onClick={() => toggleCardExpansion(index)}
                        aria-label={expandedCards[index] ? 'Collapse question details' : 'Expand question details'}
                        aria-expanded={!!expandedCards[index]}
                      >
                        {expandedCards[index] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                  </Box>

                  {/* The chart is always visible; the toggle only controls whether
                      the (potentially long) question text is clamped to 2 lines.
                      Previously the chart itself was hidden for any question over
                      100 characters, which made most cards look empty. */}
                  <Box>
                    {group.isEmpty ? (
                      <Alert severity="warning" sx={{ borderRadius: 2 }}>
                        <Typography variant="body2">
                          No response data available for this question
                        </Typography>
                      </Alert>
                    ) : (
                      <Box sx={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[group]}
                            layout="vertical"
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                            <XAxis type="number" />
                            <YAxis 
                              type="category" 
                              dataKey="shortName" 
                              width={0}
                              tick={false}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: theme.shape.borderRadius,
                                boxShadow: theme.shadows[4]
                              }}
                            />
                            <Legend />
                            {uniqueKeys.map((key, keyIndex) => (
                              <Bar
                                key={key}
                                dataKey={key}
                                stackId="responses"
                                fill={COLORS[keyIndex % COLORS.length]}
                                radius={[0, 4, 4, 0]}
                              />
                            ))}
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </ChartContainer>
            </Slide>
          ))
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
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
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