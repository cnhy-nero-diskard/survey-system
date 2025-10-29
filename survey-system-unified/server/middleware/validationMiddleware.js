// middleware/validationMiddleware.js
import { body, validationResult } from 'express-validator';

export const validateTourismAttraction = [
  body('TA_Name').notEmpty().withMessage('Name is required'),
  body('Region').notEmpty().withMessage('Region is required'),
  body('Latitude').isFloat().withMessage('Latitude must be a valid number'),
  body('Longitude').isFloat().withMessage('Longitude must be a valid number'),
  // Will come back to this
];

export const validateSurveyResponse = [
  body('user_id').isInt().withMessage('User ID must be an integer'),
  body('component_name').notEmpty().withMessage('Component name is required'),
  body('question_key').notEmpty().withMessage('Question key is required'),
  body('response_value').notEmpty().withMessage('Response value is required'),
  // Will come back to this
];

