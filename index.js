require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs/promises');
const path = require('path');
const authMiddleware = require('./middlewares/auth');

const app = express();
app.use(express.json());

const USERS_FILE = path.join(__dirname, 'usuarios.json');

const readUsers = async () => {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {

        return [];
    }
};

app.post('/auth/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ ok: false, mensaje: 'Email y password son requeridos' });
    }

    try {
        const users = await readUsers();

        if (users.find(u => u.email === email)) {
            return res.status(409).json({ ok: false, mensaje: 'El email ya está registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = { email, passwordHash, role: 'user' };
        users.push(newUser);

        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));

        res.status(201).json({ ok: true, mensaje: 'Usuario creado con éxito' });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error al registrar usuario' });
    }
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ ok: false, mensaje: 'Email y password son requeridos' });
    }

    try {
        const users = await readUsers();
        const user = users.find(u => u.email === email);

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ ok: false, mensaje: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES || '15m' }
        );

        res.status(200).json({ ok: true, token });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error interno en el login' });
    }
});

app.get('/api/perfil', authMiddleware, (req, res) => {
    res.json({ 
        ok: true, 
        data: { 
            email: req.user.email, 
            role: req.user.role,
            mensaje: "Bienvenido a tu perfil protegido"
        } 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API segura en http://localhost:${PORT}`));