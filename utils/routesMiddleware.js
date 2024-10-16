const { connectmySql } = require('../connectDB');
const UserData = require('../Models/user.model.js')

const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');


console.log("step4") 
const dbtype = process.env.DB_TYPE;


async function create(req, res) {
    const { username, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(dbtype)
    if (dbtype === 'mongodb') {
        try {
            const newUser = new UserData(
                {
                    username,
                    email,
                    password
                }
            );

            const savedUser = await newUser.save();
            res.status(201).json({
                msg: "user created successfully",
                UserDetails: {
                    id: savedUser._id,
                    username: savedUser.username,
                    email: savedUser.email
                }
            })
        } catch (error) {
            console.log("error ", error);
            res.status(400).json({
                error: error.message,
                msg: "Which type passswrd is this"
            });

        }
    }
    else if (dbtype === 'mysql') {
        const sql = `INSERT INTO usersData (username,email,password)
         VALUES(?,?,?)
        `;
        connectmySql().then((mysqlConnection) => {
            mysqlConnection.query(sql, [username, email, hashPassword], (err, result) => {
                if (err) {
                    console.error('Error saving user to the database', err);
                    return;
                }
                // console.log('User saved too the database',result);
                res.end("User saved successfully")
            });
        }).catch((err) => {
            console.error('MySQL connection error:', err);
        });
    }

}


async function list(res) {
    if (dbtype === 'mongodb') {
        try {
            const allUsers = await UserData.find();
            res.status(200).json({
                msg: "All users list",
                UserDetails: allUsers
            })

        } catch (err) {
            console.log("failed to fetch users listing", err);
            res.json({
                error: err.message
            })

        }
    } else if (dbtype === 'mysql') {
        try {
            const sql = `select * from usersData`;
            connectmySql().then((mysqlConnection) => {
                mysqlConnection.query(sql, (err, result) => {
                    if (err) {
                        console.log("error : ", err)
                    }

                   return res.status(200).json({
                        msg: "user data suceessfully fetched",
                        UserDetails: result,
                    })
                })
            })
        }
        catch (error) {
            console.log("error", error);
            res.send(404).json({
                msg: "error when data fetching"
            });
        }
    }
}




async function remove(id, email, res) {
    // const { id, email } = req.body; 

    if (dbtype === 'mongodb') {
        try {
            if (id) {
                const deleteUserById = await UserData.findByIdAndDelete(id);
                if (!deleteUserById) {
                    return res.status(404).json({ msg: "User not found" });
                }
                return res.status(200).json({
                    msg: "User deleted successfully by ID",
                    UserDetails: deleteUserById
                });
            }
            if (email) {
                const deleteUserByEmail = await UserData.findOneAndDelete({ email });
                if (!deleteUserByEmail) {
                    return res.status(404).json({ msg: "User not found" });
                }
                return res.status(200).json({
                    msg: "User deleted successfully by Email",
                    UserDetails: deleteUserByEmail
                });
            }
        } catch (error) {
            console.log("MongoDB Error: ", error);
            return res.status(500).json({ msg: "Internal Server Error" });
        }
    } else if (dbtype === 'mysql') {
        try {
            const sql = id
                ? `DELETE FROM usersData WHERE id = ?`
                : `DELETE FROM usersData WHERE email = ?`;

            const value = id || email;

            connectmySql().then((mysqlConnection) => {
                mysqlConnection.query(sql, [value], (err, result) => {
                    if (err) {
                        console.log("MySQL Error: ", err);
                        return res.status(500).json({ msg: "Internal Server Error" });
                    }
                    return res.status(200).json({ msg: "User deleted successfully in MySQL" });
                });
            });
        } catch (error) {
            console.log("MySQL Error: ", error);
            return res.status(500).json({ msg: "Internal Server Error" });
        }
    } else {
        return res.status(400).json({ msg: "Invalid database type" });
    }
}


async function login(req, res) {
    const { email, password } = req.body;
    if (dbtype === 'mongodb') {
        try {

            const existingUser = await UserData.findOne({ email });
            console.log(!existingUser)
            if (!existingUser) {
                return res.status(400).json({
                    msg: "user not found"
                });
            }
            const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
            let isMatch = await bcrypt.compare(password, existingUser.password);
            console.log(isMatch)
            if (!isMatch) {
                return res.status(400).json({
                  msg: "Invalid Password"
                })

        } 
        res.status(200).json({
            msg: "login successfully",
            UserDetails: {
                id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email
            },
            token
        })
    }
        catch (error) {
            console.log("Error: ", error)
            res.status(400).json({
                msg: "Server error 21"
            });
        }


    }
   

else if (dbtype === 'mysql') {
    try {
        // Database connection
        const mysqlConnection = await connectmySql();

        // Promise-based query using mysqlConnection.promise().query()
        const [rows] = await mysqlConnection.promise().query(`SELECT * FROM usersData WHERE email = ?`, [email]);

        // Check if user exists
        if (rows.length === 0) {
            return res.status(400).json({
                msg: "User not found"
            });
        }
        const existingUser = rows[0];
        
        const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        // Compare password using bcrypt.compare
        const isMatch = await bcrypt.compare(password, existingUser.password);
        
        if (!isMatch) {
            return res.status(400).json({
                msg: "Invalid Password"
            });
        }

        // Successful login response
        res.status(200).json({
            msg: "Login successful",
            UserDetails: {
                id: existingUser.id,
                username: existingUser.username,
                email: existingUser.email
            },
            token
        });

    } catch (error) {
        console.log("Error: ", error);
        res.status(400).json({
            msg: "Server error"
        });
    }
}


}

async function update(req, res) {
    const { username, email, password } = req.body;
    const id = req.params.id;

    if (dbtype === 'mongodb') {
        let updateUser;
        try {
            const updatedFields = {};

            // Dynamically set fields for MongoDB
            if (username) updatedFields.username = username;
            if (email) updatedFields.email = email;
            if (password) updatedFields.password = password;

            updateUser = await UserData.findByIdAndUpdate(id, updatedFields, { new: true, runValidators: true });

            if (!updateUser) {
                return res.status(404).json({ msg: "User not found" });
            }

            res.status(200).json({ msg: "User Updated successfully", userDetails: updateUser });
        } catch (error) {
            return res.status(500).json({ msg: "Internal Server Error" });
        }
    } else if (dbtype === 'mysql') {
        try {
            // Array to hold fields and their values
            let updateFields = [];
            let updateValues = [];

            // Dynamically build the update query
            if (username) {
                updateFields.push("username = ?");
                updateValues.push(username);
            }
            if (email) {
                updateFields.push("email = ?");
                updateValues.push(email);
            }
            if (password) {
                updateFields.push("password = ?");
                updateValues.push(password);
            }

            // Add the user id to the updateValues array for the WHERE clause
            updateValues.push(id);

            // If no fields are provided to update, return an error
            if (updateFields.length === 0) {
                return res.status(400).json({ msg: "No fields provided to update" });
            }

            // Build the final SQL query
            const sql = `UPDATE usersData SET ${updateFields.join(', ')} WHERE id = ?`;

            connectmySql().then((mysqlConnection) => {
                mysqlConnection.query(sql, updateValues, (err, result) => {
                    if (err) {
                        return res.status(500).json({ msg: "Internal server error" });
                    }
                    return res.status(200).json({
                        msg: "User Updated Successfully",
                        userDetails: result
                    });
                });
            });
        } catch (error) {
            return res.status(500).json({ msg: "Internal server error2" ,
                errorDetails:error.message
            });
        }
    }
}





module.exports = { list, create, remove,login,update }
