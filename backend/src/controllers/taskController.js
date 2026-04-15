const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');

// @desc    Get all tasks
// @route   GET /api/v1/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.json(tasks);
});

// @desc    Create a task
// @route   POST /api/v1/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, category } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error('Please provide title and description');
  }

  const task = new Task({
    user: req.user._id,
    title,
    description,
    status,
    priority,
    category,
  });

  const createdTask = await task.save();
  res.status(201).json(createdTask);
});

// @desc    Update a task
// @route   PUT /api/v1/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, category } = req.body;

  const task = await Task.findById(req.params.id);

  if (task) {
    if (task.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this task');
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.category = category || task.category;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Delete a task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    if (task.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this task');
    }

    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Get all tasks (Admin only)
// @route   GET /api/v1/tasks/admin
// @access  Private/Admin
const getAllTasksAdmin = asyncHandler(async (req, res) => {
  const tasks = await Task.find({}).populate('user', 'name email');
  res.json(tasks);
});

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getAllTasksAdmin,
};
