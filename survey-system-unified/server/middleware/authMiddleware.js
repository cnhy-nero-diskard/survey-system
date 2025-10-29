import jwt from 'jsonwebtoken';
import logger from './logger.js';

export const authenticate = (req, res, next) => {
    const token = req.cookies?.token;


    if (!token || typeof token !== 'string' || token.trim() === '') {
        return res.status(401).json({ error: 'UNAUTHORIZED: ' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user to the request object
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired.' });
        }
        res.status(400).json({ error: 'YOU R Unauthorized' });
    }
    logger.admin('Token found in cookie. AUTHENTICATED');
    next
};

export const authorizeAdmin = (req, res, next) => {
    if (!req.user?.role) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    next();
};
export const validateSurveyStep = async (req, res, next) => {
    const { user_id } = req.session.anonymousUserId;
    logger.warn(`[MID] validateSurveyStep for user ${user_id}`);
    const requestedStep = parseInt(req.path.split("/").pop()); // Extract step number from URL
    try {
      const result = await pool.query(
        "SELECT current_step FROM survey_progress WHERE user_id = $1",
        [user_id]
      );
      if (result.rows.length > 0) {
        const currentStep = result.rows[0].current_step;
        if (requestedStep === currentStep + 1 || requestedStep <= currentStep) {
          next(); // Allow access
        } else {
          res.status(403).json({ message: "ACCESS DENIED. FORBIDDEN" });
        }
      } else {
        res.status(404).json({ message: "User progress not found" });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  };
