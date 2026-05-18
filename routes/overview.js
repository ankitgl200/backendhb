const router = require("express").Router();
const Order = require("../models/order");
// const auth = require("../middleware/auth"); // ✅ FIXED: was missing

// ADMIN OVERVIEW
router.get("/", auth, async (req, res) => {

    try {

        // ✅ ADMIN CHECK (re-enabled)
        if (!req.user.role || req.user.role !== "admin") {
            return res.status(403).json({
                error: "Not allowed"
            });
        }

        // ALL ORDERS
        const orders = await Order.find().sort({
            createdAt: -1
        });

        // DELIVERED
        const deliveredOrders = orders.filter(
            o => o.status.toLowerCase() === "delivered"
        );

        // REJECTED
        const rejectedOrders = orders.filter(
            o => o.status.toLowerCase() === "rejected"
        );

        // PENDING
        const pendingOrders = orders.filter(
            o => o.status.toLowerCase() === "pending"
        );

        // TOTAL REVENUE (sum of all delivered orders)
        const totalRevenue = deliveredOrders.reduce(
            (sum, order) => sum + Number(order.total || 0),
            0
        );

        // ✅ TOTAL PROFIT (30% margin assumption — adjust as needed)
        const PROFIT_MARGIN = 0.30;
        const totalProfit = Math.round(totalRevenue * PROFIT_MARGIN);

        // RESPONSE
        res.json({

            totalOrders: orders.length,

            deliveredOrders: deliveredOrders.length,

            rejectedOrders: rejectedOrders.length,

            pendingOrders: pendingOrders.length,

            totalRevenue,

            totalProfit, // ✅ FIXED: now included in response

            recentDelivered: deliveredOrders.slice(0, 10)

        });

    } catch (err) {

        console.error("❌ Overview error:", err);

        res.status(500).json({
            error: "Server Error"
        });

    }

});

module.exports = router;
