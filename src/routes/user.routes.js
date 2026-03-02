const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

// Routes thường
router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Routes đặc biệt cho enable / disable
router.post('/enable', userController.enableUser);
router.post('/disable', userController.disableUser);

module.exports = router;
