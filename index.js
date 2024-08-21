const express = require('express');
const app = express();
const PORT = 3000;
const taskController = require('./controllers/taskController');
const taskValidation = require('./middlewares/taskValidation');
const checkTaskExistence = require('./middlewares/taskExistence');
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());

app.get('/tasks', taskController.getTasks);
app.get('/tasks/:id',taskController.getTask);
app.post('/tasks', taskValidation, taskController.addTask);
app.put('/tasks/:id', checkTaskExistence, taskValidation, taskController.updateTask);
app.patch('/tasks/:id', checkTaskExistence, taskController.updateStatus);
app.delete('/tasks/:id', checkTaskExistence, taskController.deleteTask);

app.get('/', (req, res) => {
    res.send('Hello');
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});
