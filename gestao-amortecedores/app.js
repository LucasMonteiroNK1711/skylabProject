require('dotenv').config();
const express = require('express');
const mongoose = require('moongoose');
const app = express();

// Middlewares
app.use(express.json()); //Para trabalhar com JSON

//Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    userUnifiedTopology: true,
})

    .then(() => console.log('conectado ao MongoDB'))
    .catch((err) => console.log('Erro ao conectar ao MongoDB:', err));

// Rotas
app.get('/', (req, res) => {
    res.send('Bem-vindo ao sistema de gestão de linha de produção!');
});


// Porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
});
