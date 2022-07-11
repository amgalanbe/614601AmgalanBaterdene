const e = require("express");

let carts = [
    // {
    //     id: 1,
    //     user: {id: 1},
    //     items: [
    //         {productId: 1, quantity: 2},
    //         {productId: 2, quantity: 3},
    //         {productId: 3, quantity: 1}, 
    //     ]
    // }, {
    //     id: 2,
    //     user: {id: 2},
    //     items: [
    //         {productId: 1, quantity: 1},
    //         {productId: 2, quantity: 1},
    //         {productId: 3, quantity: 1}, 
    //     ]
    // }
];
let idCounter = carts.length;

class Cart {
    constructor(id, userId)  {
        this.id = id;
        this.user = {id: userId};
        this.items = [];
    }

    save() {
        this.id = ++idCounter;
        carts.push(this);
        return this;
    }

    addItem(prodId) {
        const index = this.items.findIndex(i=>i.productId === prodId);
        let item;
        if(index > -1) {
            item = this.items[index];
            item.quantity++;
        } else {
            item = {productId: prodId, quantity: 0};
            this.items.push(item);
        }
        return item;
    }

    removeItem(prodId) {
        const index = this.items.findIndex(i=>i.productId === prodId);
        if(index > -1) {
            const item = this.items[index];
            item.quantity--;
            if(item.quantity <= 0) 
                this.items = this.items.filter(i=>i.productId !== prodId);
            return item;
        } else {
            throw new Error('Item NOT found');
        }
    }

    findItemById(prodId) {
        const index = this.items.findIndex(i => i.productId == prodId);
        return index > -1 ? this.items[index] : null;
    }

    static getCart(userId) {
        const index = carts.findIndex(c => c.user.id == userId);
        if (index > -1)  
            return carts[index];
        else {
            return new Cart(null, userId).save();
        }
    }

}

module.exports = Cart;