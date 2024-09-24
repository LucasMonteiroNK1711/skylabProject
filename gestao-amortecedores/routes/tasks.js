const express = require('express');
const Task = require('../models/Task');
const auth = require('../routes/auth');
const role = require('../middleware/role');
const router = express.Router();

// Criar uma nova tarefa (apenas Admins)
router.post('/', [auth, role(['admin'])], async (req, res) => {
    const { description, assignedTo } = req.body;

    try {
        const task = new Task({
            description,
            assignedTo
        });

        await task.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Listar todas as tarefas
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedTo', 'name email');
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Atualizar o status de uma tarefa (funcionário ou admin)
router.put('/:id', auth, async (req, res) => {
    const { status } = req.body;

    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: 'Tarefa não encontrada' });
        }

        // Permitir que o responsável ou um admin atualize a tarefa
        if (task.assignedTo.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'Não autorizado' });
        }

        task.status = status;
        task.updatedAt = Date.now();

        await task.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Deletar uma tarefa (apenas Admins)
router.delete('/:id', [auth, role(['admin'])], async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: 'Tarefa não encontrada' });
        }

        await task.remove();
        res.json({ msg: 'Tarefa removida' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;
