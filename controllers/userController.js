const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json({ message: 'Thiếu userName, email hoặc password' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }
    const user = new User({ userName, email, password });
    await user.save();
    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Thiếu email hoặc password' });
    }
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Email hoặc password không đúng' });
    }
    const randomString = crypto.randomBytes(16).toString('hex');
    const apiKey = `mern-${user._id}-${email}-${randomString}`;
    user.apiKey = apiKey;
    await user.save();
    res.json({ apiKey });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};