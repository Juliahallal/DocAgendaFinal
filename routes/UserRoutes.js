const express = require("express");
const router = express.Router();

// Controller
const {
  register,
  getCurrentUser,
  login,
  update,
  getUserById,
  getAllUsers,
  deleteUser,
  getPacientePorMedico,
  removeMedicoFromAssistente,
} = require("../controllers/UserController");

// Middlewares
const validate = require("../middlewares/handleValidations");
const {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
} = require("../middlewares/userValidations");
const authGuard = require("../middlewares/authGuard");
const handleMulterError = require("../middlewares/handleMulterError");

// Routes
router.post("/register", userCreateValidation(), validate, register);
router.get("/profile", authGuard, getCurrentUser);
router.post("/login", loginValidation(), validate, login);
router.put(
  "/",
  authGuard,
  userUpdateValidation(),
  validate,
  handleMulterError,
  update
);
router.get("/:id", getUserById);

router.get("/", getAllUsers);
router.delete("/:id", deleteUser);

router.put("/remover-assistente", authGuard, removeMedicoFromAssistente);

module.exports = router;
