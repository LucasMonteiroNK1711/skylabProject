const express = require('express');
const Client = require('../models/Client');
const auth = require('../routes/auth');
const role = require('../middleware/role')
const router = express.Router();

// Criar um novo cliente (apenas Admins)
router.post('/', [auth, role(['admin'])], async (req, res) => {
    const { name, email, phone, address } = req.body;

    try {
        // Verificar se o cliente já existe
        let client = await Client.findOne({ email });
        if (client) {
            return res.status(400).json({ msg: 'Cliente já cadastrado' });
        }

        // Criar novo cliente
        client = new Client({
            name,
            email,
            phone,
            address
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

// Atualizar um cliente (apenas Admins)
router.put('/:id', [auth, role(['admin'])], async (req, res) => {
    const { name, email, phone, address } = req.body;

    try {
        let client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({ msg: 'Cliente não encontrado' });
        }

        // Atualizar campos
        client.name = name || client.name;
        client.email = email || client.email;
        client.phone = phone || client.phone;
        client.address = address || client.address;

        await client.save();
        res.json(client);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Deletar um cliente (apenas Admins)
router.delete('/:id', [auth, role(['admin'])], async (req, res) => {
    try {
        let client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({ msg: 'Cliente não encontrado' });
        }

        await client.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Cliente removido' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;
