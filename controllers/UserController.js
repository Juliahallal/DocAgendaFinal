const User = require("../models/User");
const Assistente = require("../models/Assistente"); 

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const Paciente = require("../models/Paciente");

const jwtSecret = process.env.JWT_SECRET;

// gerar o token do usuario
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

// registrar usuario e login
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // checar se usuario existe
  const user = await User.findOne({ email });

  if (user) {
    res.status(422).json({ errors: ["Por favor, utilize outro e-mail."] });
    return;
  }

  // gerar password hash
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  // criar usuario
  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });

  // se foi criado o usuario com sucesso, retorna the token
  if (!newUser) {
    res.status(422).json({
      errors: ["Houve um erro, por favor tente novamente mais tarde."],
    });
    return;
  }

  res.status(201).json({
    _id: newUser._id,
    token: generateToken(newUser._id),
  });
};

// funcao pra ver usuario q esta logado
const getCurrentUser = async (req, res) => {
  const user = req.user;

  res.status(200).json(user);
};

// login
const login = async (req, res) => {
  const { email, password } = req.body;

  // Tentar encontrar o usuário
  let user = await User.findOne({ email });
  let isAssistente = false;

  // Se não encontrar o usuário, tentar encontrar o assistente
  if (!user) {
    user = await Assistente.findOne({ email });
    isAssistente = true;
  }

  // checar se o user ou assistente existe
  if (!user) {
    res.status(404).json({ errors: ["Usuário ou assistente não encontrado!"] });
    return;
  }

  // checar se senhas combinam
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({ errors: ["Senha inválida!"] });
    return;
  }

  // Retorna user ou assistente com token
  res.status(200).json({
    _id: user._id,
    isAssistente,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};

// atualiza o user
const update = async (req, res) => {
  const { name, password, bio } = req.body;

  const user = req.user;

  if (name) {
    user.name = name;
  }

  if (password) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    user.password = passwordHash;
  }

  if (bio) {
    user.bio = bio;
  }

  await user.save();

  res.status(200).json(user);
};

// pega usuario pelo id
const getUserById = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-password");

  // ve se o usuario existe
  if (!user) {
    res.status(404).json({ errors: ["Usuário não encontrado!"] });
    return;
  }

  res.status(200).json(user);
};

// ver todos os usuarios
const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
};

// deletar usuario
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "ID de usuário inválido" });
  }

  try {
    const user = await User.findOneAndDelete({ _id: id });

    if (!user) {
      return res.status(404).json({ error: "O usuário não foi encontrado" });
    }

    res.status(200).json("Usuário deletado com sucesso");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeMedicoFromAssistente = async (req, res) => {
  const medicoId = req.user._id;
  const { assistenteId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(assistenteId)) {
    return res.status(400).json({ error: "ID do assistente inválido" });
  }

  try {
    const assistente = await Assistente.findById(assistenteId);

    if (!assistente) {
      return res.status(404).json({ error: "Assistente não encontrado" });
    }

    const index = assistente.medicoIds.findIndex(
      (id) => id.toString() === medicoId.toString()
    );

    if (index === -1) {
      return res
        .status(400)
        .json({ error: "Este assistente não está vinculado a você." });
    }

    assistente.medicoIds.splice(index, 1); 

    await assistente.save();

    res.status(200).json({
      message: "Vínculo removido com sucesso",
      assistente, 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  register,
  getCurrentUser,
  login,
  update,
  getUserById,
  getAllUsers,
  deleteUser,
  removeMedicoFromAssistente,
};
