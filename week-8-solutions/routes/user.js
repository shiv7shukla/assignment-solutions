const {Router}=require("express");
const {UserModel}=require("../db");
const {z}=require("zod");
const bcrypt=require("bcrypt");

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
    {
        const {error}=requiredBody.safeParse(req.body);
        return res.json({msg:"incorrect data entry"});
    }
    else
    {
        const {email,password,firstName,lastName}=req.body;
        const hashedPwd=await bcrypt.hash(password,5);
        try{
            await UserModel.create({email,hashedPwd,firstName,lastName});
            return res.status(200).json({msg:"you are signed up"});
        }
        catch(err)
        {
            if (err.code === 11000)//duplicate error will be handles here
                return res.status(409).json({ msg: "Email already in use" });
            console.error(err);//other errors in MongoDb will be handles here using generic case
            res.status(500).json({ msg: "Internal server error" });
        }
    }  
})

//signin endpoint
userRouter.post("/signin",(req,res)=>{

})

//purchases made by user
userRouter.get("/purchases",(req,res)=>{

})

module.exports={userRouter};