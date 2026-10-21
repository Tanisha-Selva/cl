require('dotenv').config();
const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Auth0 Middleware Configuration
const config = {
  authRequired: false, // Allows public access to the home page
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  clientSecret: process.env.CLIENT_SECRET,
};

// Express-openid-connect attaches /login, /logout, and /callback routes automatically
app.use(auth(config));

// Public Route (Home)
app.get('/', (req, res) => {
  res.render('index', {
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.user,
  });
});

// Protected Route (Requires Login)
app.get('/profile', requiresAuth(), (req, res) => {
  res.render('profile', {
    user: req.oidc.user,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
