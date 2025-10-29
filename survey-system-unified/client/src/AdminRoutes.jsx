// src/AdminRoutes.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import DashboardOutlet from './components/admin/maindashboard/MDashboardOutlet';
import OverallBarangay from './components/admin/maindashboard/nestedcomponents/OverallBarangay';
import OverallSurveyTopic from './components/admin/maindashboard/nestedcomponents/OverallSurveyTopic';
import OverallOneBarangay from './components/admin/maindashboard/nestedcomponents/OverallEstablishment';
import TMGraph from './components/admin/nlp/TopicMod_scatter';
import Login from './components/admin/login/Login';
import Dashboard from './components/admin/maindashboard/Dashboard';
import HeatmapChart from './components/admin/nlp/sentimentgraphs/sentiment_heatmap';
import SurveyMetrics from './components/admin/surveryperfmetrics/SurveyMetrics';
import AIToolsDashboard from './components/admin/aitoolsdashboard/AiToolsDashboard';
import Metrics from './components/temp/metricsprom';
import UsersDashboard from './components/admin/usersdashboard/UsersDashboard';
import { useAuth } from './components/context/AuthContext';
import WarningMessage from './components/partials/WarningMessage';
import SurveyTouchpoints from './components/admin/surveytouchpoints/SurveyTouchPoints';
import EstablishmentDataDashboard from './components/admin/perestablishment/EstablishmentDataDashboard';
import AreaDashboard from './components/admin/perbarangaydashboard/BarangayDashboard';
import MunicipalityDashboard from './components/admin/permunicipalitydashboard/MunicipalityDashboard';
import AttractionDashboard from './components/admin/perattractiondashboard/AttractionDashboard';
import LogStream from './components/admin/logstream/LogStream';
import DataManager from './components/datamanager/DataManager';
import SurveyTally from './components/admin/surveytallybreakdown/SurveyTally';

const AdminRoutes = () => {
  const { isAuthenticated, unauthorized, handleUnauthorized, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const hasCheckedAuth = useRef(false); // Track if the auth check has been performed

  useEffect(() => {
    if (hasCheckedAuth.current) return; // Skip if already checked
    hasCheckedAuth.current = true; // Mark as checked

    const checkAuth = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/auth/check`, {
          withCredentials: true,
        });
        console.log('response.status', response.status);
        if (response.status === 401) {
          console.log('Unauthorized access uhh');
          handleUnauthorized();
        } else {
          login();
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        handleUnauthorized();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [handleUnauthorized, login]);

  console.log('authorized? --> ', isAuthenticated);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <>
      {unauthorized && <WarningMessage message="Unauthorized Access! Please log in." />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            isAuthenticated ? <DashboardOutlet /> : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="overallmun" element={<MunicipalityDashboard />} />
          <Route path="overallbarangay" element={<OverallBarangay />} />
          <Route path="overalltopic" element={<OverallSurveyTopic />} />
          <Route path="overallonebarangay" element={<OverallOneBarangay />} />
          <Route path="surveymetrics" element={<SurveyMetrics />} />
          <Route path="aitoolsdashboard" element={<AIToolsDashboard />} />
          <Route path="systemperf" element={<Metrics />} />
          <Route path="usersdashboard" element={<UsersDashboard />} />
          <Route path="surveytouchpoints" element={<SurveyTouchpoints />} />
          <Route path="establishmentdashboard" element={<EstablishmentDataDashboard />} />
          <Route path="barangaydashboard" element={<AreaDashboard />} />
          <Route path="attractiondashboard" element={<AttractionDashboard />} />
          <Route path="datamanager" element={<DataManager />} />
          <Route path="stally" element={<SurveyTally />} />
          <Route path="sentimentgraphs" element={<HeatmapChart />} />
          <Route path="logstream" element={<LogStream />} />
        </Route>
      </Routes>
    </>
  );
};

export default AdminRoutes;