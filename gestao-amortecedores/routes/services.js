const express = require('express');
const Service = require('../models/Service');
const auth = require('../routes/auth');
const router = express.Router();

//Criar um novo serviço
router.post('/', auth, async (req, res) => {
    const { name, deadline, assignedTo } = req.body;

    try {
        const service = new Service({
            name,
            deadline,
            assignedTo
        });


        await service.save();
        res.json(service);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

//Listar todos os serviços
router.get('/', auth, async (req, res) => {
    try {
        const services = await Service.find().populate('assignedTo', 'name email');
        res.json(services);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Atualizar um serviço
router.put('/:id', auth, async (req, res) => {
    const { name, status, deadline, assignedTo } = req.body;

    try {
        let service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ msg: 'Serviço não encontrado' });
        }

        // Atualizar os campos do serviço
        service.name = name || service.name;
        service.status = status || service.status;
        service.deadline = deadline || service.deadline;
        service.assignedTo = assignedTo || service.assignedTo;

        await service.save();
        res.json(service);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Deletar um serviço
router.delete('/:id', auth, async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ msg: 'Serviço não encontrado' });
        }

        await service.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Serviço removido' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;