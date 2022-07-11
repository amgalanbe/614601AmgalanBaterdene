const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getItems = (req, res) => {
    const cart = Cart.getCart(req.user);
    res.status(200).json(cart.items);
};

exports.addItem = (req, res) => {
    const product = Product.findById(req.body.productId);
    const cart = Cart.getCart(req.user);
    let item = cart.findItemById(product.id);    
    
    if(!item) {
        item = cart.addItem(product.id);
    }
    
    if(product.stock > item.quantity) {
        item = cart.addItem(product.id);
    }
    res.status(200).json(item);
};

exports.removeItem = (req, res) => {
    const cart = Cart.getCart(req.user);
    const item = cart.removeItem(req.body.productId);
    res.status(200).json(item);
};