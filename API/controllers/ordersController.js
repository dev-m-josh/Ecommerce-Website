const { newOrderSchema } = require("../validators/validators")

function ordersAndTotalSales(req, res) {
    let pool = req.pool;
    let {start, end} = req.query;

    if (!start || !end) {
        return res.status(400).json({
            success: false,
            message: "Start and End dates are required."
        });
    }

    pool.query(
        `SELECT 
        o.OrderId, 
    SUM(oi.Quantity * p.Price) AS TotalSales,
        o.CreatedAt
    FROM orders o
    JOIN order_items oi ON o.OrderId = oi.OrderId
    JOIN products p ON oi.ProductId = p.ProductId
    WHERE o.OrderDate BETWEEN '${start}' AND '${end}'
    GROUP BY o.OrderId, o.CreatedAt
    ORDER BY o.OrderId DESC`, (err, result) => {
        if (err) {
            res.status(500).json({
              success: false,
              message: "Internal server error.",
            });
            console.log("Error occured in query", err);
        } else {
            console.log(result)
            res.json({
                success: true,
                data: result.recordset
            });
        }
    }
  );
};

function newOrder(req, res) {
    let pool = req.pool;
    let newOrderDetails = req.body;

    const { error, value } = newOrderSchema.validate(newOrderDetails, { abortEarly: false });

    if (error) {
        console.log(error);
        return res.status(400).json({ errors: error.details });
    }

    pool.query(
        `INSERT INTO orders (UserId, ShippingAddress)
        OUTPUT Inserted.OrderId, Inserted.UserId, Inserted.ShippingAddress, 
               Inserted.OrderDate, Inserted.TotalAmount, Inserted.OrderStatus, 
               Inserted.PaymentStatus, Inserted.CreatedAt, Inserted.UpdatedAt
        VALUES ('${value.UserId}', '${value.ShippingAddress}')`,
        (err, result) => {
            if (err) {
                console.log("Error occurred in query.", err.message);
                return res.status(500).json({
                    success: false,
                    message: err.message,
                });
            } else {
                const order = result.recordset[0];
                res.json({
                    success: true,
                    message: "Cart opened successfully",
                    order: order,
                });
            }
        }
    );
};




module.exports= {
    ordersAndTotalSales,
    newOrder
};