const express = require('express');
const Category = require('../models/Category');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');

router.get('/', async (req, res) => {

    Product.find().select()
        .then((productsList) => {
            res.status(200).json(productsList);
        })
        .catch((err) => {
            res.status(500).send('Internal Server Error');
        });

});

router.get('/:productID', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.productID)) return res.status(400).send('Invalid Product ID!');

    const product = await Product.findById(req.params.productID).populate({
        path: 'category',
        model: 'Categoryy'
    });
    if (product) return res.status(200).json(product);
    else return res.status(404).send('Product Not Found');

});

router.post('/', async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const newproduct = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    });

    const savedProduct = await newproduct.save();
    if (!savedProduct) return res.status(500).send('internal server error');
    else return res.status(200).json(savedProduct);
});

router.put('/:productID', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.productID)) return res.status(400).send('Invalid Product ID!');

    const product = await Product.findById(req.params.productID);
    if (!product) return res.status(400).send('Product Not Found!')

    let newProduct = {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.productID, newProduct, {
        new: true
    })

    if (!updatedProduct) return res.status(500).send('Internal Server Error');
    return res.status(200).json(updatedProduct);

});

router.delete('/:productID', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.productID)) return res.status(400).send('Invalid Product ID!');

    const product = await Product.findById(req.params.productID);
    if (!product) return res.status(400).send('Product Not Found!');

    const deletedProduct = await Product.findByIdAndDelete(req.params.productID);
    if (!deletedProduct) return res.status(500).send('Internal Sever Error');
    return res.status(200).json(deletedProduct);
})

module.exports = router;