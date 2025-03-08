const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { newUserSchema, loginSchema } = require("../validators/validators");

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

//delete a user compeletely
function deleteUser(req, res) {
    let pool = req.pool;
    let requestedId = req.params.userId;
    pool.query(`DELETE FROM users WHERE UserId = ${requestedId}`, (err, result) =>{
        if (err) {
            res.status(500).json({
              success: false,
              message: "Internal server error.",
            });
            console.log("Error occured in query", err);
          }

        //CHECK IF REQUESTED USER IS AVAILABLE
        if (result.rowsAffected[0] === 0) {
            res.status(400).json({
            success: false,
            message: "User not found!",
            });
            return;
        }

        //RESPONSE
        res.json({
            success: true,
            message: "User deleted successfully!",
            result: result.rowsAffected,
        });
    });
};

//deactivate user account
function deactivateUser(req, res) {
    let pool = req.pool;
    let requestedId = req.params.userId;
    pool.query(`UPDATE users SET UserStatus = 'Inactive' WHERE UserId = ${requestedId}`, (err, result) =>{
        if (err) {
            res.status(500).json({
              success: false,
              message: "Internal server error.",
            });
            console.log("Error occured in query", err);
          }

        //CHECK IF REQUESTED USER IS AVAILABLE
        if (result.rowsAffected[0] === 0) {
            res.status(400).json({
            success: false,
            message: "User not found!",
            });
            return;
        }

        //RESPONSE
        res.json({
            success: true,
            message: "User deactivated successfully!",
            result: result.rowsAffected,
        });
    });
};

//login user
async function userLogin(req, res) {
    let pool = req.pool;
    let userDetails = req.body;
  
    // Validation
    const { error, value } = loginSchema.validate(userDetails, {
      abortEarly: false,
    });
    if (error) {
      console.log(error);
      return res.status(400).json({ errors: error.details });
    }
  
    let requestedUser = await pool.query(
      `SELECT UserId, FirstName, LastName, Email, PhoneNumber, UserRole, UserPassword, UserStatus FROM users WHERE Email = '${value.Email}'`
    );
    let user = requestedUser.recordset[0];
  
    // If no user is found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }
  
    // Compare passwords
    try {
      let passwordComparison = await bcrypt.compare(
        userDetails.UserPassword,
        user.UserPassword
      );
  
      // If the password matches
      if (passwordComparison) {
        // Remove the password from the user object before returning it
        const { UserPassword, ...userWithoutPassword } = user; 
  
        // Create a JWT token
        let token = jwt.sign({ UserId: user.UserId }, "impossibletoguessright");
  
        // Return the user details and token
        return res.json({
          message: "Logged in successfully",
          token,
          user: userWithoutPassword,
        });
      } else {
        return res.status(401).json({
          message: "Incorrect credentials!",
        });
      }
    } catch (error) {
      console.error("Error during password comparison:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

module.exports = { getAllUsers, addNewUser, deleteUser, deactivateUser, userLogin };