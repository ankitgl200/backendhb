const router = require("express").Router();
const Product = require("../models/product");

// GET PRODUCTS
router.get("/", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// UPDATE STOCK
router.post("/update-stock", async (req, res) => {
    const { items } = req.body;

    for (let item of items) {
        await Product.findByIdAndUpdate(item.id, {
            $inc: { stock: -item.qty }
        });
    }

    res.json({ success: true });
});

router.post("/update-product", async (req, res) => {
    try {
        const { id, name, stock, price, oprice, src, cat } = req.body;

        let updateData = {};

        if (name !== undefined) updateData.name = name;
        if (stock !== undefined) updateData.stock = stock;
        if (price !== undefined) updateData.price = price;
        if (oprice !== undefined) updateData.oprice = oprice;
        if (src !== undefined) updateData.src = src;
        if (cat !== undefined) updateData.cat = cat;

        await Product.findByIdAndUpdate(id, updateData);

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.json({ success: false });
    }
});


// ADD OR UPDATE PRODUCT STOCK
router.post("/add-product", async (req, res) => {
    const { name, price, oprice, cat, src, stock } = req.body;

    try {
        let product = await Product.findOne({ name });

        if (product) {
            // update stock
            product.stock += stock;
            product.price = price;
            product.oprice = oprice;
            product.cat = cat;
            product.src = src;
            await product.save();
        } else {
            // create new product
            product = new Product({ name, price, oprice, cat, src, stock });
            await product.save();
        }

        res.json({ success: true, product });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;




