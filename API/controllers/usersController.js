const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { newUserSchema } = require("../validators/validators");

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

//sign-up for a new user
async function addNewUser(req, res) {
    let pool = req.pool;
    let addedUser = req.body;

    const { error, value } = newUserSchema.validate(addedUser, {
        abortEarly: false
    });

    if (error) {
        console.log(error);
        return res.status(400).json({ errors: error.details });
    };

    let hashedPassword = await bcrypt.hash(value.UserPassword, 5);

    let token = await jwt.sign({ addedUser }, "impossibletoguessright");

    pool.query(
        `INSERT INTO users (FirstName, LastName, Email, PhoneNumber, UserRole, UserPassword)
    VALUES ('${value.FirstName}', '${value.LastName}', '${value.Email}', '${value.PhoneNumber}', '${value.UserRole}', '${hashedPassword}')`, (err, result) =>{
    if (err) {
        console.log("Error occured in query", err);
    } else {
        res.json({
            success: true,
            message: "User added successfully",
            addedUser,
            token
        });
    };
    }
  );
};

//delete a user

module.exports = { getAllUsers, addNewUser };