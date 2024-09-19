const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('/models/User');
const router = express.Router();

// Rota para registro de usuários
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        //verificar se o usuário já existe
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Usuário já existe' });
        }

        // Criar novo usuário
        user = new User({
            name,
            email,
            password,
            role,
        });

        // Salvar usuário no banco
        await user.save();

        //gerar token JWT para o usuário
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Rota para login de usuários


module.exports = router;