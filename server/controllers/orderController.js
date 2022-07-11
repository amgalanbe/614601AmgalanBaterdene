const Cart = require('../models/cart');
const Product = require('../models/product');

exports.placeOrder = (req, res) => {
    const cart = Cart.getCart(req.user);

    for(let i in cart.items) {
        const item = cart.items[i];
        let product = Product.findById(item.productId);
        
        if(product.stock < item.quantity) {
            res.status(200).json({error: 'Stock limit is reached for product: ' + product.name});
            return;
        }
    }

    
    for(let i in cart.items) {
        const item = cart.items[i];
        let product = Product.findById(item.productId);
        product.stock -= item.quantity;
    }
    cart.items = [];
    res.status(200).json(Product.getProducts());  
};