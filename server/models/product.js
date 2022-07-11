let products = [
    {
        id: 1,
        name: 'NodeJS',
        image: '/assets/node.png',
        price: 9.99,
        stock: 8
    }, {
        id: 2,
        name: 'Angular',
        image: '/assets/angular.png',
        price: 19.99,
        stock: 5
    }, {
        id: 3,
        name: 'VueJS',
        image: '/assets/vue.png',
        price: 29.99,
        stock: 13
    }, {
        id: 4,
        name: 'ReactJS',
        image: '/assets/react.png',
        price: 39.99,
        stock: 7
    }
];
let idCounter = products.length;

class Product {
    constructor(id, name, image, price, stock,){
        this.id = id;
        this.name = name;
        this.image = image;
        this.price = price;
        this.stock = stock;
    }

    save() {
        this.id = ++idCounter;
        products.push(this);
        return this;
    }

    update() {
        const index = products.findIndex(p => p.id === this.id);
        if (index > -1) {
            products.splice(index, 1, this);
            return this;
        } else {
            throw new Error('NOT Found');
        }

    }

    static getProducts() {
        return products;
    }

    static findById(productId) {
        const index = products.findIndex(p => p.id == productId);
        if (index > -1) {
            return products[index];
        } else {
            console.log("throwing error " + productId);
            throw new Error('NOT Found');
        }
    }
}

module.exports = Product;