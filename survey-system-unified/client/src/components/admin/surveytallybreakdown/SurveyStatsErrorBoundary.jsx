import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Alert, 
  Card, 
  CardContent,
  Fade 
} from '@mui/material';
import { 
  ErrorOutline as ErrorIcon,
  Refresh as RefreshIcon 
} from '@mui/icons-material';

class SurveyStatsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('Survey Statistics Error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Fade in timeout={600}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '50vh',
              p: 3
            }}
          >
            <Card 
              sx={{ 
                maxWidth: 600, 
                textAlign: 'center',
                boxShadow: 3,
                borderRadius: 3
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <ErrorIcon 
                  sx={{ 
                    fontSize: 64, 
                    color: 'error.main', 
                    mb: 2 
                  }} 
                />
                <Typography variant="h4" gutterBottom color="error">
                  Oops! Something went wrong
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  The Survey Statistics dashboard encountered an unexpected error. 
                  This might be a temporary issue.
                </Typography>
                
                <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                  <Typography variant="body2">
                    <strong>Error Details:</strong><br />
                    {this.state.error && this.state.error.toString()}
                  </Typography>
                </Alert>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={this.handleRetry}
                    sx={{ 
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a6fd8, #6a4190)'
                      }
                    }}
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => window.location.reload()}
                  >
                    Reload Page
                  </Button>
                </Box>

                {process.env.NODE_ENV === 'development' && (
                  <Box sx={{ mt: 3, textAlign: 'left' }}>
                    <Typography variant="caption" color="text.secondary">
                      Development Error Stack:
                    </Typography>
                    <Box 
                      component="pre" 
                      sx={{ 
                        fontSize: '0.75rem', 
                        backgroundColor: '#f5f5f5', 
                        p: 2, 
                        borderRadius: 1,
                        overflow: 'auto',
                        maxHeight: 200
                      }}
                    >
                      {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Fade>
      );
    }

    return this.props.children;
  }
}

export default SurveyStatsErrorBoundary;