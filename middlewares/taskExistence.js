const { readTasks } = require('../controllers/taskController');

const checkTaskExistence = (req, res, next) => {
    const id = parseInt(req.params.id);
    const tasks = readTasks();
    const task = tasks.find(task => task.id === id);
    if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
    }
    req.task = task;
    next();
};

module.exports = checkTaskExistence;
