const express = require('express');
const res = require('express/lib/response');
const {
    re
} = require('prettier/doc');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const {
    applyPatch
} = require('prettier');
const mongoose = require('mongoose');
const Product = require('./models/product');
const router = express.Router();
const cors = require('cors');

// importing routers
const productsRouter = require('./routes/product');
const categoryRouter = require('./routes/category');


// middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
// middlaware for configuring CORS (Cross Origin Resource Sharing)
app.use(cors());
app.options('*',cors());


// To use Enviornment variables in .env file
require('dotenv/config');
const api = process.env.API_URL;

// passing client request to the their routes
app.use(`${api}/products`,productsRouter);
app.use(`${api}/category`,categoryRouter);

mongoose.connect(process.env.DATABASE_CONNECTION_STRING)
    .then(() => {
        console.log('Database is connected to cloud successfully')
    })
    .catch((err) => {
        console.log(err)
    })


app.listen(3000, () => {
    console.log("Server is Successfully Started On Port 3000!");
});