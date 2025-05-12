const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    const { userId, content } = req.body;
    if (!userId || !content) {
      return res.status(400).json({ message: 'Thiếu userId hoặc content' });
    }
    const post = new Post({ userId, content });
    await post.save();
    res.status(201).json({ message: 'Tạo bài viết thành công', post });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Thiếu content' });
    }
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Bài viết không tồn tại' });
    }
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Không có quyền cập nhật bài viết' });
    }
    post.content = content;
    post.updatedAt = Date.now();
    await post.save();
    res.json({ message: 'Cập nhật bài viết thành công', post });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};