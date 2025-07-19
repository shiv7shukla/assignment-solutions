const {Router}=require("express");
const {UserModel}=require("../db");

const userRouter=Router();

//signup endpoint
userRouter.post("/signup",(req,res)=>{

})

//signin endpoint
userRouter.post("/signin",(req,res)=>{

})

//purchases made by user
userRouter.get("/purchases",(req,res)=>{

})

module.exports={userRouter};