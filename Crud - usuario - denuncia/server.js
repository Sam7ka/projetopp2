const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuração para o Express entender dados de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (terminiCT declarações declaradas anonimas de aluno paia queimo pc)
app.use(express.static(path.join(__dirname, 'public')));

// CONFIGURAÇÃO DO BANCO DE DADO!!!111!!11 :D

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: false // Desativa os logs de SQL no console para manter limpinho
});

// Definindo o Modelo (Tabela) de Denúncia Anonima Disque 180
const Denuncia = sequelize.define('Denuncia', {
    laboratorio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    computador_numero: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao_dano: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

// RO(O)TAS DA APLICACION

// Rota para RECEBER a denúncia (Anonima Disque 180){pra n perder a piada} (Método POST)
app.post('/api/denuncias', async (req, res) => {
    try {
        const { laboratorio, computador_numero, descricao_dano } = req.body;

        // Cria o registro no bd
        await Denuncia.create({
            laboratorio,
            computador_numero,
            descricao_dano
        });

        res.status(201).json({ mensagem: 'Denúncia registrada com sucesso! A equipe de manutenção agradece.' });
    } catch (erro) {
        console.error('Erro ao salvar denúncia:', erro);
        res.status(500).json({ erro: 'Ocorreu um erro ao processar sua denúncia.' });
    }
});

// Rota para a equipe de TI VER as denúncias (anonimas disque, tá parei :c) (Método GET)
app.get('/api/denuncias', async (req, res) => {
    try {
        // Busca todas as denúncias, ordenando das mais recentes para as mais antigas
        const denuncias = await Denuncia.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(denuncias);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar denúncias.' });
    }
});

// INICIALIZAÇÃO DO SERVIDOR

sequelize.sync() // Sincroniza o modelo com o banco (cria a tabela se não existir, pelo amor of lord pls funciona)
    .then(() => {
        console.log('Banco de dados sincronizado.');
        app.listen(PORT, () => {
            console.log(`Servidor rodando em: http://localhost:${PORT}`);
        });
    })
    .catch(erro => console.error('Erro ao conectar com o banco:', erro));


//Cabo bb. (Amém.)