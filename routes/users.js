const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Đăng ký
router.post('/register', async (req, res) => {
    const { userName, email, password } = req.body;

    // Kiểm tra thông tin bắt buộc
    if (!userName || !email || !password) {
        return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ userName, email và password' });
    }

    try {
        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email đã được sử dụng' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới
        const user = new User({
            userName,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: 'Đăng ký thành công', user: { userName, email } });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server' });
    }
});

module.exports = router;

const crypto = require('crypto');

// Đăng nhập
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Kiểm tra thông tin bắt buộc
    if (!email || !password) {
        return res.status(400).json({ error: 'Vui lòng cung cấp email và password' });
    }

    try {
        // Tìm user theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Email không tồn tại' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Mật khẩu không đúng' });
        }

        // Tạo random string
        const randomString = crypto.randomBytes(16).toString('hex');

        // Tạo apiKey
        const apiKey = `mern-${user._id}-${email}-${randomString}`;

        // Cập nhật apiKey trong DB
        user.apiKey = apiKey;
        await user.save();

        res.status(200).json({ message: 'Đăng nhập thành công', apiKey });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server' });
    }
});