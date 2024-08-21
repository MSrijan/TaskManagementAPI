const taskValidation = (req, res, next) => {
    const { task, status } = req.body;
    if (!task || !status) {
        return res.status(400).json({ success: false, message: 'Task and status are required.' });
    }
    next();
};

module.exports = taskValidation;
