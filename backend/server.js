import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { usersData } from './data/users.js';
import { productsData } from './data/products.js';
const app = express();
const JWT_SECRET = 'ECOM_MOCK_SECRET';
const PORT = 4000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// In-memory (reset khi restart)
let users = [...usersData];

function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Missing token' });
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = payload;
        next();
    });
}

app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ message: 'Thiếu name/email/password' });
    if (users.some(u => u.email === email)) return res.status(409).json({ message: 'Email đã tồn tại' });

    const id = Date.now().toString();
    const user = { id, name, email, role: 'user', password };
    users.push(user);

    const token = jwt.sign({ id, email, name, role: 'user' }, JWT_SECRET, { expiresIn: '30m' });
    res.status(201).json({ user: { id, name, email, role: 'user' }, token });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Thiếu email/password' });
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ message: 'Thông tin đăng nhập sai' });

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '30m' });
    res.json({ token });
});

app.get('/api/users', auth, (req, res) => {
    res.json(users.map(({ password, ...u }) => u));
});

app.listen(PORT, () => {
    console.log(` API chạy ở http://localhost:${PORT}`);
    console.log('Restart server để reset dữ liệu in-memory.');
});
//api/products
let products = [...productsData];
app.get('/api/products', (req, res) => {
    const { featured } = req.query;
    let list = products;
    if (featured === '1' || featured === 'true') {
        list = products.filter(p => p.featured);
    }
    res.json(list);
});