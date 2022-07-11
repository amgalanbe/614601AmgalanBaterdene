const express = require('express');
const cors = require('cors');
const path = require('path');

const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'images')));
app.use('/auth', userRouter);

app.use((req, res, next) => {
    const auth = req.headers.authorization;
    if(auth) {
        const token = auth.split(' ')[1];
        if(token == 'null') {
            res.json({error: 'No Access Token'});
        } else {
            req.user = token.split('-')[0];
            next();
        }
    } else {
        res.json({error: 'User is not logged in'});
    }
    
});

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/orders', orderRouter);

app.use((req, res, next) => {
    res.status(404).json({ error: req.url + ' API not supported!' });
});

app.use((err, req, res, next) => {
    res.status(500).json({error: 'Something went wrong ' + err});
});

app.listen(3000, () => console.log('listening to port 3000...'));