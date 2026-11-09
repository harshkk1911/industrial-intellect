import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export async function login(req, res, next) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const admin = await Admin.findOne({ email }).select('+passwordHash');
    if (!admin || !admin.isActive) return res.status(401).json({ message: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Invalid email or password' });

    admin.lastLoginAt = new Date();
    await admin.save();

    const token = jwt.sign({ sub: admin._id.toString(), role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });

    res.json({
      token,
      user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (error) { next(error); }
}

export async function me(req, res) {
  res.json({ user: { id: req.admin._id, name: req.admin.name, email: req.admin.email, role: req.admin.role } });
}
