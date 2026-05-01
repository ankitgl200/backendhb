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
    const { id, stock, price, oprice, src, cat } = req.body;

    let update = {};

    if (stock !== undefined) update.stock = stock;
    if (price !== undefined) update.price = price;
    if (oprice !== undefined) update.oprice = oprice;
    if (src !== undefined) update.src = src;
    if (cat !== undefined) update.cat = cat;

    await Product.findByIdAndUpdate(id, update);

    res.json({ success: true });
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




