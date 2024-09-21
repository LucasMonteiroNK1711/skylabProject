require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Importat as rotas de autenticação
const authRoutes = require('./routes/auth');

// Middlewares
app.use(express.json()); //Para trabalhar com JSON

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/gestao_amortecedores', {
    serverSelectionTimeoutMS: 30000
})
    .then(() => console.log('conectado ao MongoDB'))
    .catch((err) => console.log('Erro ao conectar ao MongoDB:', err));


// Rotas
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Bem-vindo ao sistema de gestão de linha de produção!');
});

const services = require('./routes/services');

// Usar as rotas de serviços
app.use('/api/services', services);

const employees = require('./routes/employees');
const clients = require('./routes/clients');

// Usar as rotas de funcionários e clientes
app.use('/api/employees', employees);
app.use('/api/clients', clients);


// Porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
});
