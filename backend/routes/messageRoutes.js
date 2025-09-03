const express = require('express');
const {
  getMessages,
  createMessage,
  getConversations,
} = require('../controllers/messageController');
const { protect } = require('../controllers/authController');

const router = express.Router();

router.use(protect);

router.get('/conversations', getConversations);
router.get('/:roomId', getMessages);
router.post('/', createMessage);

module.exports = router;
