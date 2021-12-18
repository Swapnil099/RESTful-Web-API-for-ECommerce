const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

router.get('/', async (req, res) => {
    const categoryList = await Category.find().catch((e) => {
        res.status(404).send('category not found')
    });
    res.status(200).send(categoryList);
});

router.post('/', async (req, res) => {
    let newCategory = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    });

    newCategory = await newCategory.save().catch((e) => {
        res.send('the Category cannot be created')
    })

    res.send(newCategory)
});

router.put('/:categoryID', async (req, res) => {
    Category.findById(req.params.categoryID)
        .then(async (category) => {
            if (!category) return res.status(404).send('Category not found!');

            let updatedCategory = {
                name: req.body.name,
                icon: req.body.icon,
                color: req.body.color
            }

            updatedCategory = await Category.findByIdAndUpdate(req.params.categoryID, updatedCategory, {
                new: true
            }).catch((e) => {
                return res.status(500).send('Internal Error occured');
            });

            return res.status(200).json({
                updatedCategory: updatedCategory,
                success: true
            });
        })
        .catch((err) => {
            return res.status(404).send('Invalid Category ID')
        });

});

router.delete('/:categoryID', async (req, res) => {

    Category.findById(req.params.categoryID)
        .then(async (category) => {
            if (!category) return res.status(404).send('Category not found!');

            const deletedCategory = await Category.findByIdAndDelete(req.params.categoryID).catch((e) => {
                return res.status.apply(500).send('Internal Error occured');
            });

            return res.status(200).send(`${deletedCategory.name} category is deleted successfully`);
        })
        .catch((err) => {
            return res.status(404).send('Invalid Category ID')
        });

});

module.exports = router;