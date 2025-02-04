const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { v4: uuidv4 } = require('uuid');  
const db = require('./db');  
require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',  // Adjust if frontend runs on a different port
    credentials: true
  }
});

// Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const { sendContactEmail } = require('./controllers/contactController');
const cartRoutes = require('./routes/cartRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const orderRoutes = require("./routes/orderRoutes");

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());

// Session Configuration
const sessionStore = new pgSession({
  pool: db,
  tableName: 'session'
});

app.use((req, res, next) => {
  console.log('Request received:', req.method, req.url);
  next();
});

app.use(
  session({
    genid: () => {
      const sid = uuidv4();
      console.log(`Generated session ID: ${sid}`);
      return sid;
    },
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: false
    }
  })
);

// Make `io` available to controllers
app.set('io', io);

// Define Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/checkout', checkoutRoutes);
app.post('/api/contact', sendContactEmail);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use("/api/orders", orderRoutes);

// Root API Route
app.get('/', (req, res) => {
  console.log('Root endpoint accessed');
  res.send('Hello, Perfume Store API');
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
