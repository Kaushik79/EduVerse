const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const axios = require('axios');

const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ 
        where: { email } 
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentId: user.studentId,
          department: user.department,
          avatar: user.avatar
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async register(req, res) {
    try {
      const { name, email, password, role, studentId, department } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'student',
        studentId,
        department
      });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentId: user.studentId,
          department: user.department
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async githubLogin(req, res) {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const callbackUrl = process.env.GITHUB_CALLBACK_URL;
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${callbackUrl}&scope=user:email`;
    res.redirect(githubAuthUrl);
  },

  async githubCallback(req, res) {
    const { code } = req.query;
    if (!code) return res.status(400).json({ message: 'No code provided' });

    try {
      const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: process.env.GITHUB_CALLBACK_URL,
        },
        { headers: { Accept: 'application/json' } }
      );

      const accessToken = tokenResponse.data.access_token;
      if (!accessToken) return res.status(400).json({ message: 'Failed to obtain access token' });

      const userResponse = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const profile = userResponse.data;

      let email = profile.email;
      if (!email) {
        const emailsResponse = await axios.get('https://api.github.com/user/emails', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const primaryEmailObj = emailsResponse.data.find(e => e.primary) || emailsResponse.data[0];
        if (primaryEmailObj) email = primaryEmailObj.email;
      }
      
      if (!email) {
        email = `${profile.login}@github.unknown`;
      }

      let user = await User.findOne({ where: { githubId: profile.id.toString() } });
      
      if (!user) {
        user = await User.findOne({ where: { email } });
      }

      const dummyPassword = await bcrypt.hash(Math.random().toString(), 10);
      if (user) {
        user.githubId = profile.id.toString();
        user.username = profile.login;
        user.avatarUrl = profile.avatar_url;
        user.accessToken = accessToken;
        // Ensure user has dummy password if somehow missing
        if (!user.password) {
            user.password = dummyPassword;
        }
        await user.save();
      } else {
        user = await User.create({
          githubId: profile.id.toString(),
          username: profile.login,
          avatarUrl: profile.avatar_url,
          accessToken,
          email,
          name: profile.name || profile.login,
          password: dummyPassword,
          role: 'student'
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        avatar: user.avatarUrl || user.avatar
      };

      const encodedUser = encodeURIComponent(JSON.stringify(userData));
      res.redirect(`http://localhost:5173/login?token=${token}&user=${encodedUser}`);
    } catch (error) {
      console.error('GitHub Auth Error:', error);
      res.redirect('http://localhost:5173/login?error=GitHubAuthFailed');
    }
  }
};

module.exports = authController;
