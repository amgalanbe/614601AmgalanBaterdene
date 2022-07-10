const express = require('express');
const cors = require('cors');

const userRouter = require('./routes/user');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', userRouter);

app.use((req, res, next) => {
    const auth = req.headers.authorization;
    const token = auth.split(' ')[1];
    if(token == 'null') {
        res.json({error: 'No Access Token'});
    } else {
        req.user = token.split('-')[0];
        next();
    }
});

app.use((err, req, res, next) => {
    res.status(500).json({error: 'Something went wrong ' + err});
});

app.listen(3000, () => console.log('listening to port 3000...'));