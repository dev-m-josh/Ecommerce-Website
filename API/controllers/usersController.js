//get all users
function getAllUsers(req, res) {
    let pool = req.pool;
    let { page, pageSize } = req.query;
    let offset = (Number(page) - 1) * Number(pageSize);
    pool.query(
        `SELECT UserId, FirstName, LastName, Email, PhoneNumber, UserRole, created_at
        FROM users
        WHERE UserStatus = 'Active'
        ORDER BY UserId ASC OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`, (err, result) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: "Internal server error."
                });
                console.log("Error occured in query", err);
            } else {
                res.json(result.recordset);
            };
        }
    );
};

module.exports = { getAllUsers };