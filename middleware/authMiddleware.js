const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const apiKey = req.query.apiKey;
    if (!apiKey) {
      return res.status(401).json({ message: 'Thiếu apiKey' });
    }
    const user = await User.findOne({ apiKey });
    if (!user) {
      return res.status(401).json({ message: 'apiKey không hợp lệ' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xác thực', error: error.message });
  }
};

module.exports = authenticate;