const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();
app.use(express.json());

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

const Relatorio = sequelize.define('Relatorio', {
  maquina: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pendente'
  }
});

sequelize.sync();

app.use(express.static(path.join(__dirname, 'site')));





app.post('/api/relatorios', async (req, res) => {
  try {
    const novoRelatorio = await Relatorio.create(req.body);
    res.status(201).json(novoRelatorio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/relatorios', async (req, res) => {
  const relatorios = await Relatorio.findAll();
  res.json(relatorios);
});

app.put('/api/relatorios/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  await Relatorio.update({ status }, { where: { id } });
  res.json({ message: 'Status atualizado' });
});

app.delete('/api/relatorios/:id', async (req, res) => {
  const { id } = req.params;
  await Relatorio.destroy({ where: { id } });
  res.json({ message: 'Relatório deletado' });
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});