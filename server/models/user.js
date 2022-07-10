let users = [
    {id: 1, username: 'John', password: '111'},
    {id: 2, username: 'Edward', password: '222'}
];
let idCounter = users.length;

class User {
    constructor(id, username, password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    static findUserByUsernameAndPassword(username, password) {
        return users.find(u=> u.username === username && u.password === password);
    }
}

module.exports = User;