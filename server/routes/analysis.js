const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Save analysis result
router.post('/save', authenticateToken, async (req, res) => {
  try {
    const { roleId, roleTitle, atsScore, matchedSkills, missingSkills, suggestions } = req.body;

    const [result] = await db.query(
      `INSERT INTO resume_analyses 
       (user_id, role_id, role_title, ats_score, matched_skills, missing_skills, suggestions) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.userId,
        roleId,
        roleTitle,
        atsScore,
        JSON.stringify(matchedSkills),
        JSON.stringify(missingSkills),
        JSON.stringify(suggestions)
      ]
    );

    res.status(201).json({
      message: 'Analysis saved successfully',
      analysisId: result.insertId
    });
  } catch (error) {
    console.error('Save analysis error:', error);
    res.status(500).json({ error: 'Failed to save analysis' });
  }
});

// Get user's analysis history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const [analyses] = await db.query(
      `SELECT id, role_id, role_title, ats_score, created_at 
       FROM resume_analyses 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [req.userId]
    );

    res.json({ analyses });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Get specific analysis details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [analyses] = await db.query(
      `SELECT * FROM resume_analyses 
       WHERE id = ? AND user_id = ?`,
      [req.params.id, req.userId]
    );

    if (analyses.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    const analysis = analyses[0];
    analysis.matched_skills = JSON.parse(analysis.matched_skills);
    analysis.missing_skills = JSON.parse(analysis.missing_skills);
    analysis.suggestions = JSON.parse(analysis.suggestions);

    res.json({ analysis });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ error: 'Failed to fetch analysis' });
  }
});

module.exports = router;
