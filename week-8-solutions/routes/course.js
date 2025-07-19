const {Router}=require("express");

const courseRouter=Router();

//course to be purchased by the user
courseRouter.post("/purchase",(req,res)=>{

})

//all the courses available
courseRouter.get("/bulk",(req,res)=>{

})

module.exports={courseRouter};