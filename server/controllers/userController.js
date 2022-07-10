const User = require('../models/user');

exports.login = (req, res) => {
    const user = User.findUserByUsernameAndPassword(req.body.username, req.body.password);
    if(user) {
        res.json({accessToken: `${user.id}-${user.username}-${Date.now().toString()}`});
    } else {
        res.json({error: 'Invalid username or password!'});
    }
};
