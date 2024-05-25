const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const usersFilePath = path.join(__dirname, '../storage/users.json');

const readUsersFromFile = (callback) => {
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return callback(err, null);
        }
        const users = JSON.parse(data);
        callback(null, users);
    });
};

const writeUsersToFile = (users, callback) => {
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), callback);
};

exports.registerUser = (req, res) => {
    const { name, email, password } = req.body;
    readUsersFromFile((err, users) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }
        const userExists = users.some(user => user.email === email);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = {
            id: uuidv4(),
            name,
            email,
            password: bcrypt.hashSync(password, 10),
            photo: '',
            bio: '',
            phone: '',
            isPublic: true,
            role: 'user'
        };
        users.push(newUser);
        writeUsersToFile(users, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Server error' });
            }
            const payload = { user: { id: newUser.id } };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        });
    });
};

exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    readUsersFromFile((err, users) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }
        const user = users.find(user => user.email === email);
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    });
};

exports.getUserProfile = (req, res) => {
    readUsersFromFile((err, users) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }
        const user = users.find(user => user.id === req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    });
};

exports.updateUserProfile = (req, res) => {
    const { name, photo, bio, phone, email, isPublic, password } = req.body;
    readUsersFromFile((err, users) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }
        const userIndex = users.findIndex(user => user.id === req.user.id);
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updatedUser = { ...users[userIndex], name, photo, bio, phone, email, isPublic };
        if (password) {
            updatedUser.password = bcrypt.hashSync(password, 10);
        }
        users[userIndex] = updatedUser;
        writeUsersToFile(users, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Server error' });
            }
            res.json(updatedUser);
        });
    });
};

exports.listPublicProfiles = (req, res) => {
    readUsersFromFile((err, users) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }
        const publicUsers = users.filter(user => user.isPublic).map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
        res.json(publicUsers);
    });
};

exports.listAllProfiles = (req, res) => {
    readUsersFromFile((err, users) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }
        const usersWithoutPassword = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
        res.json(usersWithoutPassword);
    });
};

