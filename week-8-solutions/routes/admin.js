const {Router}=require("express");
const{AdminModel}=require("../db");

const adminRouter=Router();

//signup endpoint
adminRouter.post("/signup",(req,res)=>{
})

//signin endpoint
adminRouter.post("/signin",(req,res)=>{

})

//course creation endpoint
adminRouter.post("/course",(req,res)=>{
    
})

//change the course endpoint
adminRouter.put("/course",(req,res)=>{

})

//all the courses created endpoint
adminRouter.get("/course/bulk",(req,res)=>{

})

module.exports={adminRouter};