const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
// const create = require('../utils/routesMiddleware');
const allOperations = require('../utils/routesMiddleware');


console.log("setp 1");


const UserDataSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:[true,'Name is required'],
            minlength:[3,'Name ust be 3 character long'],
        },
        email:{
            type:String,
            required:[true,'Email is required'],
            unique:true,
            match:[/.+@.+\..+/, 'Please enter a valid email address']

        },
        password:{
                    type:String,
                    required:[true, 'Password is required'],
                    minlength: [6, 'Password must be at least 6 characters long']
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
);

UserDataSchema.pre("save", async function(next){
     if(!this.isModified('password')) 
        {
            return next();
        }
     try {
         const salt = await bcryptjs.genSalt(10);
         this.password = await bcryptjs.hash(this.password,salt);
         next();
         
         
     } catch (error) {
         return next(error);
         
     }
});
const UserData = mongoose.model("UserData", UserDataSchema);
// console.log(UserData);




module.exports =  UserData;
   
