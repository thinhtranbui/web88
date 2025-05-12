const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authenticate = require('../middleware/authMiddleware');

router.post('/', authenticate, postController.createPost);
router.patch('/:id', authenticate, postController.updatePost);

module.exports = router;