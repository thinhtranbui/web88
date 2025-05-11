const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authenticate = require('../middleware/auth');

// Tạo bài post
router.post('/', authenticate, async (req, res) => {
    const { userId, content } = req.body;

    // Kiểm tra thông tin bắt buộc
    if (!userId || !content) {
        return res.status(400).json({ error: 'Vui lòng cung cấp userId và content' });
    }

    // Kiểm tra userId có khớp với user từ apiKey
    if (userId !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Không có quyền tạo bài post' });
    }

    try {
        const post = new Post({
            userId,
            content
        });

        await post.save();
        res.status(201).json({ message: 'Tạo bài post thành công', post });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server' });
    }
});

module.exports = router;

// Cập nhật bài post
router.put('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Vui lòng cung cấp content' });
    }

    try {
        // Tìm bài post
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Bài post không tồn tại' });
        }

        // Kiểm tra quyền
        if (post.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Không có quyền cập nhật bài post' });
        }

        // Cập nhật
        post.content = content;
        post.updatedAt = Date.now();
        await post.save();

        res.status(200).json({ message: 'Cập nhật bài post thành công', post });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server' });
    }
});