const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pendente', 'em andamento', 'concluído'],
        default: 'pendente'
    },
    deadline: {
        type: Date,
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    createdAt: {
        type: Date,
        deafult: Date.now
    }
});

module.exports = mongoose.model('Service', ServiceSchema);