const router = require("express").Router();

const Order = require("../models/order");


// ADMIN OVERVIEW
router.get("/", /*auth,*/ async (req, res) => {

    try {

        // ALL ORDERS
        const orders = await Order.find().sort({
            createdAt: -1
        });

        const deliveredOrders = orders.filter(
            o => (o.status || "").toLowerCase() === "delivered"
        );

        const rejectedOrders = orders.filter(
            o => (o.status || "").toLowerCase() === "rejected"
        );

        // TOTAL REVENUE
        const totalRevenue = deliveredOrders.reduce(
            (sum, order) =>
                sum + Number(order.total || 0),
            0
        );

        // RESPONSE
        res.json({

            totalOrders: orders.length,

            deliveredOrders: deliveredOrders.length,

            rejectedOrders: rejectedOrders.length,

            totalRevenue,

            recentDelivered:
                deliveredOrders.slice(0, 10)

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: "Server Error"
        });

    }

});

module.exports = router;
