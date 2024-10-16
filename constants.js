
// .
// ├── config/
// │   ├── dbconnect.js           # Database  connection for both MySQL and MongoDB
// │   └── dotenv.config.js       # Environment variables setup
// ├── controllers/
// │   └── userController.js      # Controller for user-related logic (signup, login, CRUD)
// │
// ├── middleware/
// │   └── authMiddleware.js      # JWT authentication and authorization middleware
// │
// ├── models/
// │   ├── user.model.js          # User schema for MongoDB (Mongoose) and MySQL
// │
// ├── routes/
// │   └── users.js               # User-related routes (signup, login, CRUD)
// │
// ├── services/
// │   └── userService.js         # Service layer for handling database operations for users
// │
// ├── utils/
// │   ├── validation.js          # Validation logic for user input (express-validator)
// │   └── hashPassword.js        # Utility for password hashing (bcrypt)
// │
// ├── app.js                     # Main application file
// ├── package.json               # Dependencies
// ├── .env                       # Environment variables (MySQL/MongoDB credentials)
// └── README.md                  # Project documentation




// {"username": "username21",
// "email":"username1@gmail.com",
// "password":"test@123"}



// async function updateUser(req,res){
//     const {username,email,password} = req.body;
//     const id = req.params.id;
//     if(dbtype==='mongodb'){



//         let updateUser
//         try{
//                  updateUser = await UserData.findByIdAndUpdate(id,{username,email,password},{new:true,runValidators:true});

//             if(!updateUser){
//             return res.status(404).json({
//                 msg:"User not found"
//             });

//             }

//             res.status(200).json({
//                 msg:"User Updated successfully using id ",
//                 userDetails:updateUser
//             });


//         }catch(error){
//             return res.status(500).json({msg:"Internal Server Error 12 : "});

//         }
//     }else if (dbtype === 'mysql') {
//         try {
//             const sql = `UPDATE usersData SET username = ?, email = ?, password = ? where id=?`;
    
//             connectmySql().then((mysqlConnection) => {
//                 mysqlConnection.query(sql, [username, email, password,id], (err, result) => {
//                     if (err) {
//                         return res.status(500).json({ msg: "query error" });
//                     }
//                     return res.status(200).json({ msg: "User Updated Successfully",
//                         userDetails:result
//                      }
                        
//                     );
//                 });
//             });
//         } catch (error) {
//             return res.status(500).json({ msg: "Internal server error2" });
//         }
//     }
    
// }

    //     const sql = `select * from usersData where email= ${email}`;
    //     if(sql){
    //         const pass = `select password from userData where email=${sql}`;
    //         console.log(pass);

    //     }
    //     connectmySql().then((mysqlConnection)=>{
    //         mysqlConnection.query(sql,(err,result)=>{
    //             if(err){
    //                 res.status(500).json({msg:"error"});
    //             }
    //         })
    //     })


    //  }
// }



// async function handleDelete(id,email,res){
//     if(dbtype==='mongodb'){
//         if(id)
//             {


//         try {
//             // const id= req.query;
//                 const deleteUser = await UserData.findByIdAndDelete(id);
//                 if (!deleteUser) {
//                     return res.status(404).json({ msg: "User not found" });
//                   }
//                 res.status(200).json({
//                     msg:"user deleted Successfully",
//                     UserDetails:deleteUser,
//                 })



//         } catch (error) {
//             console.log("new error", error);
//             res.status(500).json({msg:"Internal Server Error"});

//         }
//     }else if(dbtype==='mysql'){
//             const sql = `delete from usersData where id = ${id}`;
//             connectmySql().then((mysqlConnection)=>{
//                 mysqlConnection.query(sql,(err,result)=>{
//                     if(err){
//                         console.log("error occur")
//                     }
//                 res.status(200).json({msg:"user deleted successfully"})
//                 })
//             })


//     }
//     if(email){
//         try {
//             // const id= req.query;
//                 const deleteUser = await UserData.findOneAndDelete(email);
//                 header,{
//                     'Content-Type':'Application/json',
//                 }
//                 if (!deleteUser) {
//                     return res.status(404).json({ msg: "User not found" });
//                   }
//                 res.status(200).json({
//                     msg:"user deleted using email Successfully",
//                     UserDetails:deleteUser,
//                 })



//         } catch (error) {
//             console.log("new error", error);
//             res.status(500).json({msg:"Internal Server Error"});

//         }
//     }else if(dbtype==='mysql'){
//             const sql = `delete from usersData where email = ${email}`;
//             connectmySql().then((mysqlConnection)=>{
//                 mysqlConnection.query(sql,(err,result)=>{
//                     if(err){
//                         console.log("error occur")
//                     }
//                 res.status(200).json({msg:"user deleted successfully"})
//                 })
//             })



//     }
// }

// }








































// // const express = require('express');
// // const router = express.Router();
// // const MongoUser = require('../models/user.mongo.model');
// // const mysqlConnection = require('../models/user.mysql.model');

// // // Create a new user
// // router.post('/create', async (req, res) => {
// //     const { username, email, password } = req.body;

// //     if (process.env.DB_TYPE === 'mongodb') {
// //         try {
// //             const newUser = new MongoUser({ username, email, password });
// //             await newUser.save();
// //             res.status(201).json({ message: 'User created in MongoDB', user: newUser });
// //         } catch (err) {
// //             res.status(400).json({ error: err.message });
// //         }
// //     } else if (process.env.DB_TYPE === 'mysql') {
// //         const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
// //         mysqlConnection.query(sql, [username, email, password], (err, results) => {
// //             if (err) return res.status(500).json({ error: err.message });
// //             res.status(201).json({ message: 'User created in MySQL', userId: results.insertId });
// //         });
// //     }
// // });

// // // Fetch all users
// // router.get('/', (req, res) => {
// //     if (process.env.DB_TYPE === 'mongodb') {
// //         MongoUser.find({}, (err, users) => {
// //             if (err) return res.status(500).json({ error: err.message });
// //             res.status(200).json(users);
// //         });
// //     } else if (process.env.DB_TYPE === 'mysql') {
// //         const sql = `SELECT * FROM users`;
// //         mysqlConnection.query(sql, (err, results) => {
// //             if (err) return res.status(500).json({ error: err.message });
// //             res.status(200).json(results);
// //         });
// //     }
// // });

// // // Other CRUD routes (update, delete) will follow the same pattern
// // // ...

// // module.exports = router;
