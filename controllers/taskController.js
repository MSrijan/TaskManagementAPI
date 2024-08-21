const fs = require('fs');
const path = require('path');
const taskPath = path.join(__dirname, '..', 'data', 'task.json');

const readTasks = () => {
    try {
        if (!fs.existsSync(taskPath)) {
            throw new Error('task.json not found');
        }
        const tasks = fs.readFileSync(taskPath, 'utf-8');
        return JSON.parse(tasks);
    } catch (error) {
        throw new Error(error.message);
    }
}

const writeTasks = (tasks) => {
    try {
        fs.writeFileSync(taskPath, JSON.stringify(tasks, null, 2), 'utf-8');
    } catch (error) {
        throw new Error(error.message);
    }
}

const getTasks = (req, res) => {
    try {
        const { status } = req.query;
        let tasks = readTasks();
        if (status) {
            tasks = tasks.filter(task => task.status.toLowerCase() === status.toLowerCase());
        }
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getTask = (req, res) => {
    try {
        const tasks = readTasks();
        const id = parseInt(req.params.id);
        const task = tasks.find(task => task.id === id);
        if (task) {
            res.status(200).json(task);
        } else {
            res.status(404).json({ success: false, message: "Task not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const addTask = (req, res) => {
    try {
        const newTask = {
            id: null,
            task: req.body.task,
            description: req.body.description,
            status: req.body.status || 'Pending'
        };
        const tasks = readTasks();
        newTask.id = (tasks.length ? Math.max(...tasks.map(task => task.id)) + 1 : 1);
        tasks.push(newTask);
        writeTasks(tasks);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const updateTask = (req, res) => {
    try {
        const updatedTask = {
            id: parseInt(req.params.id),
            task: req.body.task,
            description: req.body.description
        };

        const tasks = readTasks();
        const index = tasks.findIndex(task => task.id === updatedTask.id);

        if (index !== -1) {
            if (updatedTask.task !== undefined) {
                tasks[index] = { ...tasks[index], task: updatedTask.task };
            }
            if (updatedTask.description !== undefined) {
                tasks[index] = { ...tasks[index], description: updatedTask.description };
            }
            writeTasks(tasks);
            res.status(200).json(tasks[index]);
        } else {
            res.status(404).json({ success: false, message: "Task not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const updateStatus = (req, res) => {
    try {
        const allowedStatuses = ["completed", "pending", "ongoing", "missed"];
        const updatedStatus = {
            id: parseInt(req.params.id),
            status: req.body.status ? req.body.status.toLowerCase() : undefined
        };
        const tasks = readTasks();
        const index = tasks.findIndex(task => task.id === updatedStatus.id);

        if (index !== -1) {
            if (updatedStatus.status !== undefined) {
                if (allowedStatuses.includes(updatedStatus.status)) {
                    tasks[index] = { ...tasks[index], status: updatedStatus.status };
                    writeTasks(tasks);
                    res.status(200).json(tasks[index]);
                } else {
                    res.status(400).json({ success: false, message: "Invalid status value" });
                }
            } else {
                res.status(400).json({ success: false, message: "Status is required" });
            }
        } else {
            res.status(404).json({ success: false, message: "Task not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const deleteTask = (req, res) => {
    try {
        const deleteId = parseInt(req.params.id);
        const tasks = readTasks();
        const index = tasks.findIndex(task => task.id === deleteId);

        if (index !== -1) {
            tasks.splice(index, 1);
            writeTasks(tasks);
            res.status(200).json({ success: true, message: 'Task deleted' });
        } else {
            res.status(404).json({ success: false, message: "Task not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    getTask, getTasks, addTask, updateStatus, updateTask, deleteTask,readTasks
}
