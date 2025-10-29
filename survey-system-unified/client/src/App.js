
/**
 * Initializes the anonymous user by making an API call to the backend.
 * Logs the success or failure of the initialization process.
 * 
 * @async
 * @function initializeAnonymousUser
 * @returns {Promise<void>}
 */

/**
 * The main App component that sets up the routing for the application.
 * It initializes the anonymous user on mount and provides the AuthProvider context.
 * 
 * @component
 * @returns {JSX.Element} The rendered component.
 */
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import RouteSelector from './routes/RouteSelector';
import AdminRoutes from './AdminRoutes';
import WebpageRoutesDev from './WebpageRoutesDev';
import NotFound from './components/admin/fallback/NotFound';
import { AuthProvider } from './components/context/AuthContext';
import Login from './components/admin/login/Login';
import SurveyRoutes from './routes/SurveyRoutes';
const App = () => {
  const initializeAnonymousUser = async () => {
    console.log('Initializing anonymous user...');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/init-anonymous-user`, {
        withCredentials: true, 
      });

      if (response.status === 200) {
        console.log('Anonymous user initialized successfully');
      } else {
        console.error('Failed to initialize anonymous user');
      }
    } catch (error) {
      console.error('Error initializing anonymous user:', error);
    }
  };

  useEffect(() => {
    initializeAnonymousUser();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <style>
          {`
            body {
              background-color:#00a2ff ;
              height: 100vh;
              margin: 0;
            }
            .App {
              height: 100vh;
              display: flex;
              flex-direction: column;
            }
          `}
        </style>
        <Routes>
          {/* Default route to show the RouteSelector */}
          <Route path="/" element={<RouteSelector />} />

          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/login" element={<Login />} />

          {/* App Routes */}
          {/* <Route path="/devpath1/*" element={<WebpageRoutesDev />} /> */}
          <Route path="/survey/*" element={<SurveyRoutes />} />
          <Route path="/feedback/*" element={<SurveyRoutes />} />

          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;