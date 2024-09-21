const express = require('express');
const Client = require('../models/Client');
const auth = require('../routes/auth');
const router = express.Router();

// Criar um novo cliente
router.post('/', auth, async (req, res) => {
    const { name, email, phone } = req.body;

    try {
        const client = new Client({
            name,
            email,
            phone
        });

        await client.save();
        res.json(client);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Listar todos os clientes
router.get('/', auth, async (req, res) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Atualizar um cliente
router.put('/:id', auth, async (req, res) => {
    const { name, email, phone } = req.body;

    try {
        let client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({ msg: 'Cliente não encontrado' });
        }

        // Atualizar os campos do cliente
        client.name = name || client.name;
        client.email = email || client.email;
        client.phone = phone || client.phone;

        await client.save();
        res.json(client);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Deletar um cliente
router.delete('/:id', auth, async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({ msg: 'Cliente não encontrado' });
        }

        await client.remove();
        res.json({ msg: 'Cliente removido' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;
