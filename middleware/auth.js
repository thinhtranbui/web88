const User = require('../models/User');

const authenticate = async (req, res, next) => {
    const apiKey = req.query.apiKey;

    if (!apiKey) {
        return res.status(401).json({ error: 'Thiếu apiKey' });
    }

    try {
        const user = await User.findOne({ apiKey });
        if (!user) {
            return res.status(401).json({ error: 'apiKey không hợp lệ' });
        }

        req.user = user; // Lưu thông tin user để sử dụng trong route
        next();
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server' });
    }
};

module.exports = authenticate;