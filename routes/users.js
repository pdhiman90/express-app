
require('dotenv').config();
var express = require('express');
const userData = require('../Models/user.model')
var router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();



app.use(express.json());
/* GET users listing. */
module.exports = router.get('/listing', async (req, res, next) => {
  const Users = await userData.find();
  res.status(200).json({
    msg: "all user listing",
    userDetails: Users
  })
  // res.send('respond with a resource');
});


// login route-----

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log(req.body.password);

  // console.log(password);
  try {

    const existUser = await userData.findOne({ email });
    // console.log(existUser)
    if (!existUser) {
      return res.status(400).json({ msg: "user not found" });
    }


    // console.log(existUser.password);
    const token = jwt.sign({ id: existUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    const isMatch = await bcrypt.compare(password, existUser.password);
    // console.log(isMatch);
    // console.log(!isMatch)
    if (!isMatch) {
      return res.status(400).json({
        msg: "Invalid Password"
      })
    }

    // if(existUser.password!==password){
    //         return res.status(400).json({msg:"Invalid password"}); 
    // }



    res.status(200).json({
      msg: "Login successfully",
      token,
      userDetails: {
        id: existUser._id,
        username: existUser.username,
        email: existUser.email
      }
    })

  } catch (error) {
    console.log("Error: ", error)
    res.status(400).json({
      msg: "Server error"
    });

  }
});




// signup route

module.exports = router.post('/signup',
  [
    body('username')
      .notEmpty().withMessage('username is required')
      .isString().withMessage('Username must be String')
      .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters.'),
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please enter valid email..')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('password must be required')
      .isLength({ min: 6 }).withMessage('Passsword must have atleast 6 characters')
      .matches(/(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])/).withMessage('Password must contain at least one number, one uppercase letter, and one special character')


  ], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;

    try {
      const existingUser = await userData.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "User already exist...." });
      }

      const newUser = new userData({
        username,
        email,
        password,

      })

      const savedUser = await newUser.save();
      res.status(201).json({
        meg: "User saved Successfully",
        userDetails: {
          id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,

        }
      })


    } catch (error) {
      console.log("error ", error);
      res.status(501).json({
        msg: "server error"
      })
    }
  })






// update user route


// module.exports = router.put('/update/:id', async (req, res)=> {
//   const userId = req.params.id;
//   const { username, email, password } = req.body;

//   try {
//     const updateUser = await userData.findByIdAndUpdate(
//       userId,
//       { username, email, password },
//       { new: true, runValidators: true }

//     );

//     if (!updateUser) {
//       return res.status(404).json({ msg: "user not found" });
//     }


//     res.status(200).json({
//       msg: "user Successfully updated",
//       userDetails: updateUser
//     })
//   } catch (error) {
//     console.log("error: ", error);
//     return res.status(500).json({ msg: "Internal server error" });
//   }
// })








module.exports = router.put('/update', async (req, res) => {
  const { id, email } = req.query; // Query string se id ya email lena

  const { username, password } = req.body; // User details jo update karni hain
  try {
    let updateUser;

    if (id) {
      updateUser = await userData.findByIdAndUpdate(id, { username, password }, { new: true, runValidators: true });
    } 

    if (email) {
      updateUser = await userData.findOneAndUpdate({ email: email }, { username, password }, { new: true, runValidators: true });
    }

    if (!updateUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      msg: "User updated successfully using either id or email",
      userDetails: updateUser
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});




// delete user route


// module.exports = router.delete('/delete/:id', async (req, res) => {
//   const userId = req.params.id;

//   try {
//     const existUser = await userData.findByIdAndDelete(userId);
//     console.log(existUser);
//     if (!existUser) {
//       return res.status(404).json({ msg: "User not found" })
//     }
//     res.status(200).json({ msg: "user deleted successfully" });
//   } catch (error) {
//     console.log("Error: ", error);
//     return res.status(500).json(
//       {
//         msg: "internal server error"
//       })
//   }
// })



// module.exports=router.delete('/delete',async(req,res)=>{
//   const {id,email} = req.params;

//   try {
//     let deleteUser;
    
//     if(id){
//       deleteUser=await userData.findByIdAndDelete(id);
//     }

//     if(email){
//       deleteUser = await userData.findOneAndDelete(email);
//     }

//     if(!deleteUser){
//       return res.status(404).json({ msg: "User not found" });
//     }


//     res.status(200).json({
//       msg:"User deleted successfully using both id or email",
//       userDetails:deleteUser
//     })

//   } catch (error) {
//     console.log("Error: ", error);
//     return res.status(500).json({ msg: "Internal server error" });

    
//   }

// });


module.exports = router.delete('/delete', async (req, res) => {
  const { id, email } = req.query; 

  try {
    let deleteUser;

    if (id) {
      deleteUser = await userData.findByIdAndDelete(id);
    }


    if (email) {
      deleteUser = await userData.findOneAndDelete({ email }); 
    }

    if (!deleteUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      msg: "User deleted successfully using either id or email",
      userDetails: deleteUser
    });

  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});



