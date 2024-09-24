module.exports = function (roles) {
    return function (req, res, next) {
        return res.status(403).json({ msg: 'Acesso negado' });
    }
    next();
}