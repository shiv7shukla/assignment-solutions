const {Router}=require("express");
const {UserModel}=require("../db");
const {z}=require("zod");
const {UserMiddleware}=require("../middlewares/user")
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const JWT_USER_PWD=process.env.JWT_USER_PWD;

const userRouter=Router();


//signup endpoint
userRouter.post("/signup",async (req,res)=>{
    const requiredBody=z.object({
        email:z.email(),
        password:z.string().min(3).max(100),
        firstName:z.string(),
        lastName:z.string()
    });
    const {success}=requiredBody.safeParse(req.body);
    if(!success)
        return res.json({msg:"incorrect data entry"});
    else
    {
        const {email,password,firstName,lastName}=req.body;
        const hashedPwd=await bcrypt.hash(password,5);
        try{
            await UserModel.create({email,password:hashedPwd,firstName,lastName});
            return res.json({msg:"you are signed up"});
        }
        catch(err)
        {
            if (err.code === 11000)//duplication errors will be handles here
                return res.status(409).json({ msg: "Email already in use" });
            console.error(err);//other errors in MongoDb will be handles here using generic case
            res.status(500).json({ msg: "Internal server error" });
        }
    }  
})

//signin endpoint
userRouter.post("/signin",async (req,res)=>{
    const requiredBody=z.object({
        email:z.email()
    });
    const {success}=requiredBody.safeParse(req.body);
    if(!success)
        return res.status(401).json({msg:"invalid email"});
    else
    {
        let user;
        const {email,password}=req.body;
        try{
            user=await UserModel.findOne({email});
            if(!user)
                return res.status(404).json({msg:"user not found"});
            const match=await bcrypt.compare(password,user.password);
            if(!match)
                return res.status(401).json({msg:"invalid password"});
            const token=jwt.sign({id:user._id.toString()},JWT_USER_PWD);
            return res.json({token,msg:"signed in"});
        }
        catch(err)
        {
            if (err.name === "CastError")
                return res.status(400).json({ msg: "Invalid ID format" });
            res.status(500).json({ msg: "Internal server error" });
        }
    }
})

//purchases made by user
userRouter.get("/purchases",UserMiddleware,(req,res)=>{
})

module.exports={userRouter};