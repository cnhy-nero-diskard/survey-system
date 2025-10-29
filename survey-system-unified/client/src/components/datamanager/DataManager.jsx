import React, { useState } from 'react';
import LocalizationUI from './LocalizationUI';
import EstablishmentsUI from './EstablishmentsUI';
import TourismAttractionUI from './TourismAttractionUI';
import { drawerWidth } from '../admin/maindashboard/MDashboardOutlet';
import { Center } from '@chakra-ui/react';
import SurveyResponsesUI from './SurveyResponsesUI';
import AnonymousUsersHandler from './AnonymousUsersHandler';
import SurveyFeedbackManager from './FeedbackManager';

const ModalMan = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: drawerWidth,
      width: `calc(100vw - ${drawerWidth}px)`,
    }}>
      <div style={{
        backgroundColor: 'transparent',
        padding: '20px',
        borderRadius: '5px',
        width: '100%',
      }}>
        <button onClick={onClose} style={{
          width: '75px',
          justifyContent: 'center',
          alignContent: 'center',
          top: '10px',
          right: '10px',
          background: 'red',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
        }}>&times;</button>
        {children}
      </div>
    </div>
  );
};

const DataManager = () => {
  const [activeGroup, setActiveGroup] = useState('localization');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (group) => {
    setActiveGroup(group);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', fontSize: 'm' }}>CRUD Management</h1>
      
      {/* Selection UI */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => openModal('localization')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: activeGroup === 'localization' ? '#007BFF' : '#6C757D',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = activeGroup === 'localization' ? '#0056b3' : '#5a6268'}
          onMouseOut={(e) => e.target.style.backgroundColor = activeGroup === 'localization' ? '#007BFF' : '#6C757D'}
          aria-pressed={activeGroup === 'localization'}
        >
          Localization
        </button>
        <button
          onClick={() => openModal('establishments')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: activeGroup === 'establishments' ? '#007BFF' : '#6C757D',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = activeGroup === 'establishments' ? '#0056b3' : '#5a6268'}
          onMouseOut={(e) => e.target.style.backgroundColor = activeGroup === 'establishments' ? '#007BFF' : '#6C757D'}
          aria-pressed={activeGroup === 'establishments'}
        >
          Establishments
        </button>
        <button
          onClick={() => openModal('tourismAttractions')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: activeGroup === 'tourismAttractions' ? '#007BFF' : '#6C757D',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = activeGroup === 'tourismAttractions' ? '#0056b3' : '#5a6268'}
          onMouseOut={(e) => e.target.style.backgroundColor = activeGroup === 'tourismAttractions' ? '#007BFF' : '#6C757D'}
          aria-pressed={activeGroup === 'tourismAttractions'}
        >
          Tourism Attractions
        </button>
        <button
          onClick={() => openModal('surveyresponses')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: activeGroup === 'surveyresponses' ? '#007BFF' : '#6C757D',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = activeGroup === 'surveyresponses' ? '#0056b3' : '#5a6268'}
          onMouseOut={(e) => e.target.style.backgroundColor = activeGroup === 'surveyresponses' ? '#007BFF' : '#6C757D'}
          aria-pressed={activeGroup === 'surveyresponses'}
        >
          Survey Responses
        </button>
        <button
          onClick={() => openModal('anonhandler')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: activeGroup === 'anonhandler' ? '#007BFF' : '#6C757D',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = activeGroup === 'anonhandler' ? '#0056b3' : '#5a6268'}
          onMouseOut={(e) => e.target.style.backgroundColor = activeGroup === 'anonhandler' ? '#007BFF' : '#6C757D'}
          aria-pressed={activeGroup === 'anonhandler'}
        >
          Anonymous Users
        </button>
        <button
          onClick={() => openModal('feedbackhandler')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: activeGroup === 'anonhandler' ? '#007BFF' : '#6C757D',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = activeGroup === 'anonhandler' ? '#0056b3' : '#5a6268'}
          onMouseOut={(e) => e.target.style.backgroundColor = activeGroup === 'anonhandler' ? '#007BFF' : '#6C757D'}
          aria-pressed={activeGroup === 'anonhandler'}
        >
          Open Feedbacks
        </button>
      </div>

      {/* Modal */}
      <ModalMan isOpen={isModalOpen} onClose={closeModal}>
        {activeGroup === 'localization' && <LocalizationUI />}
        {activeGroup === 'establishments' && <EstablishmentsUI />}
        {activeGroup === 'tourismAttractions' && <TourismAttractionUI />}
        {activeGroup === 'surveyresponses' && <SurveyResponsesUI />} 
        {activeGroup === 'anonhandler' && <AnonymousUsersHandler />} 
        {activeGroup === 'feedbackhandler' && <SurveyFeedbackManager />} 
      </ModalMan>
    </div>
  );
};

export default DataManager;