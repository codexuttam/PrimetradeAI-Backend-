const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getAllTasksAdmin,
} = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getTasks)
    .post(protect, createTask);

router.route('/admin')
    .get(protect, admin, getAllTasksAdmin);

router.route('/:id')
    .put(protect, updateTask)
    .delete(protect, deleteTask);

module.exports = router;
