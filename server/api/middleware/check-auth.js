const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            message: 'Unauthorized request'
        });
    }
    const token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        return res.status(401).json({
            message: 'Unauthorized request'
        });
    }
    const payload = jwt.verify(token, `${process.env.JWT_KEY}`);
    if (!payload) {
        return res.status(401).json({
            message: 'Unauthorized request'
        });
    }
    console.log(payload.userId)
    req.userId = payload.userId;
    next();
}