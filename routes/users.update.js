require('dotenv').config();
const express = require('express');
const router = express.Router();
const app = express();
app.use(express.json());
const database = require('../utils/routesMiddleware');
const { userValidationRules, validate } = require('../utils/validation')
console.log("step3");



router.post('/create',userValidationRules(),validate,(req,res)=>{
    database.create(res);
});



router.get('/list',(req,res)=>{
    database.list(res);
})
router.delete('/delete',(req,res)=>{
    const {id,email} = req.body;
    database.remove(id,email,res);  
    })
router.post('/login',(req,res)=>{
    database.login(req,res);

})
router.put('/update/:id',userValidationRules(),validate,(req,res)=>{
    database.update(req,res);
})
module.exports = router;