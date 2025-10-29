
// utils/api.js
import { getApiUrl } from '../../config/apiConfig.js';

const API_HOST = getApiUrl(''); // This will handle both unified and separate deployments

// Localization CRUD
export const createLocalization = async (key, languagecode, textcontent, component) => {
  const response = await fetch(getApiUrl('/api/admin/localization'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, languagecode, textcontent, component }),
    credentials: 'include',
  });
  return response.json();
};

export const fetchLocalizations = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await fetch(getApiUrl(`/api/admin/localization?${queryParams}`), {
    credentials: 'include',
  });
  return response.json();
};

export const updateLocalization = async (id, key, languagecode, textcontent, component) => {
  const response = await fetch(getApiUrl('/api/admin/localization'), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, key, languagecode, textcontent, component }),
    credentials: 'include',
  });
  return response.json();
};

export const deleteLocalization = async (id) => {
  const response = await fetch(getApiUrl('/api/admin/localization'), {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
    credentials: 'include',
  });
  return response.json();
};

export const createEstablishment = async (formData) => {
  const {
    est_name, type, city_mun, barangay, latitude, longitude,
    english, korean, chinese, japanese, russian, french, spanish, hindi
  } = formData;

  console.log(`ESTABLISHMENT NAME CREATE --> ${est_name}`);

  const response = await fetch(getApiUrl('/api/admin/establishment'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      est_name, type, city_mun, barangay, latitude, longitude,
      english, korean, chinese, japanese, russian, french, spanish, hindi,
    }),
    credentials: 'include',
  });
  return response.json();
};

export const fetchEstablishment = async (filters = {}) => {
  const response = await fetch(getApiUrl('/api/admin/establishment'), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  return response.json();
};

export const updateEstablishment = async (id, formData) => {
  const {
    est_name, type, city_mun, barangay, latitude, longitude,
    english, korean, chinese, japanese, russian, french, spanish, hindi
  } = formData;

  const response = await fetch(getApiUrl('/api/admin/establishment'), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id, est_name, type, city_mun, barangay, latitude, longitude,
      english, korean, chinese, japanese, russian, french, spanish, hindi,
    }),
    credentials: 'include',
  });
  return response.json();
};

export const deleteEstablishment = async (id) => {
  console.log(`DELETE ESTABLISHMENT WITH ID ${id}`);
  const response = await fetch(getApiUrl('/api/admin/establishment'), {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
    credentials: 'include',
  });
  return response.json();
};

export const createTourismAttraction = async (attractionData) => {
  console.log('CRUDAPI - CREATING TOURISM ATTRACITON');

  const response = await fetch(getApiUrl('/api/admin/touattraction'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(attractionData),
    credentials: 'include',
  });
  return response.json();
};

export const fetchTourismAttractions = async () => {
  console.log('CRUDAPI - FETCHUNG TOURISM ATTRACITON');

  const response = await fetch(getApiUrl('/api/admin/touattraction'), {
    credentials: 'include',
  });
  console.log(`TOUATTRACTION DATA -> ${JSON.stringify(response)}`);
  return response.json();
};

export const updateTourismAttraction = async (id, attractionData) => {
  console.log('CRUDAPI - UPDATING TOURISM ATTRACITON');

  const response = await fetch(getApiUrl('/api/admin/touattraction'), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(attractionData),
    credentials: 'include',
  });
  return response.json();
};

export const deleteTourismAttraction = async (id) => {
  console.log('CRUDAPI - DELETING TOURISM ATTRACITON');

  const response = await fetch(getApiUrl('/api/admin/touattraction'), {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
    credentials: 'include',
  });
  return response.json();
};

export const createSurveyResponse = async (anonymous_user_id, surveyquestion_ref, response_value) => {
  const response = await fetch(getApiUrl('/api/admin/survey-responses'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ anonymous_user_id, surveyquestion_ref, response_value }),
    credentials: 'include',
  });
  return response.json();
};

export const fetchSurveyResponses = async () => {
  const response = await fetch(getApiUrl('/api/admin/survey-responses'), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  return response.json();
};

export const updateSurveyResponse = async (response_id, response_value) => {
  const response = await fetch(getApiUrl('/api/admin/survey-responses'), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ response_value }),
    credentials: 'include',
  });
  return response.json();
};

export const deleteSurveyResponse = async (anonymous_user_id) => {
  const response = await fetch(getApiUrl('/api/admin/survey-responses'), {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ anonymous_user_id }),
    credentials: 'include',
  });
  return response.json();
};

export const fetchResponsesByUserAndQuestion = async (anonymous_user_id, surveyquestion_ref) => {
  const response = await fetch(getApiUrl('/api/admin/survey-responses/user-question'), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ anonymous_user_id, surveyquestion_ref }),
    credentials: 'include',
  });
  return response.json();
};
