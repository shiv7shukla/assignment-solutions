const {Router}=require("express");
const {AdminModel,CourseModel}=require("../db");
const {z}=require("zod");
const {AdminMiddleware}=require("../middlewares/admin")
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const JWT_ADMIN_PWD=process.env.JWT_ADMIN_PWD;

const adminRouter=Router();

//signup endpoint
adminRouter.post("/signup",async (req,res)=>{
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
            await AdminModel.create({email,password:hashedPwd,firstName,lastName});
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
adminRouter.post("/signin",async (req,res)=>{
    const requiredBody=z.object({
        email:z.email()
    });
    const {success}=requiredBody.safeParse(req.body);
    if(!success)
        return res.status(401).json({msg:"invalid email"});
    else
    {
        const {email,password}=req.body;
        try{
            const admin=await AdminModel.findOne({email});
            if(!admin)
                return res.status(404).json({msg:"admin not found"});
            const match=bcrypt.compare(password,admin.password);
            if(!match)
                return res.status(401).json({msg:"invalid password"});
            const token=jwt.sign({id:admin._id.toString()},JWT_ADMIN_PWD);
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

//course creation endpoint
adminRouter.post("/",AdminMiddleware,async(req,res)=>{
    const requiredBody=z.object({
        title:z.string(),
        description:z.string(),
        price:z.number().nonnegative(),
        imageurl:z.url()
    });
    const {success}=requiredBody.safeParse(req.body);
    if(!success)
        return res.status(400).json({msg:"invalid data"});
    else
    {
        const {title,description,price,imageurl}=req.body;
        try{
            const course=await CourseModel.create({title,description,price,imageurl,creatorId:req.id});
            return res.status(201).json({msg:"course created",courseId:course._id});
        }
        catch(err)
        {
            console.error(err);//other errors in MongoDb will be handles here using generic case
            res.status(500).json({ msg: "Internal server error" });
        }
    }
})

//change the course endpoint
adminRouter.put("/",AdminMiddleware,async(req,res)=>{
    const requiredBody=z.object({
        title:z.string(),
        description:z.string(),
        price:z.number().nonnegative(),
        imageurl:z.url()
    });
    const {success}=requiredBody.safeParse(req.body);
    if(!success)
        return res.status(401).json({msg:"invalid data"});
    else
    {
        const {title,description,price,imageurl,courseId}=req.body;
        try{
            const course=await CourseModel.findOne({_id:courseId,creatorId:req.id});
            if(!course)
                return res.status(401).json({msg:"unauthorized acess"});
            const update=await CourseModel.updateOne({_id:courseId},{title,description,price,imageurl});
            if(update.matchedCount===0)
                return res.status(404).json({ msg: "Course not found" });
            if(update.modifiedCount===0)
                return res.json({ msg: "No changes made, course already up-to-date" });
            return res.json({msg:"course updated"});
        }
        catch(err)
        {
            return res.status(500).json({ msg: "Internal server error" });
        }
    }
})

//all the courses created endpoint
adminRouter.get("/bulk",AdminMiddleware,async (req,res)=>{
    try{
        const course=await CourseModel.find({creatorId:req.id});
        if(!course)
            return res.status(404).json({msg:"no course found"});
        return res.json({course});
    }
    catch(err)
        {
            return res.status(500).json({ msg: "Internal server error" });
        }
})

module.exports={adminRouter};