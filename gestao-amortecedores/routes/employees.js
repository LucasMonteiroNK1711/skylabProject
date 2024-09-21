const express = require('express');
const bycrypt = require('bcryptjs');
const User = require('../models/user');
const auth = require('../routes/auth');
const router = express.Router();

// Criar um novo funcionário (apenas Admins)
router.post('/', auth, async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        //verificar se o usuário já existe
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Funcionário já cadastrado' });
        }
        // Criar novo funcionário
        user = new User({
            name,
            email,
            password,
            role: role || 'funcionario'
        });

        // Criptografar a senha
        const salt = await bycrypt.genSalt(10);
        user.password = await bycrypt.hash(password, salt);

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
    }
});

// Listar todos os funcionários
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find({ role: 'funcionario' }).select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Atualizar um funcionário
router.put('/:id', auth, async (req, res) => {
    const { name, email, role } = req.body;

    try {
        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(400).json({ msg: 'Funcionário não encontrado' });
        }

        //Atualizar campos
        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Deletar um funcionário
router.delete('/:id', auth, async (req, res) => {
    try {
        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'Funcionário não encontrado' });
        }

        await user.remove();
        res.json({ msg: 'Funcionário removido' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;