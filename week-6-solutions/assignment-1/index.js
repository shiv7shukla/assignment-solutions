const express=require("express");
const app=express();
app.use(express.json());

const jwt=require("jsonwebtoken");
const JWT_SECRET="anything";

const users=[];

app.post("/signup",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    if(users.find(u=>u.username===username&&u.password===password))
        res.json({msg:"already signed up"});
    else
    {
        users.push({username,password});
        res.json({msg:"signed up!!!"});
    }
})

app.post("/signin",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    if(users.find(u=>u.username===username&&u.password===password))
    {
        const token=jwt.sign({username},JWT_SECRET);
        res.json({msg:"signed in",token});
    }
    else
        res.json({msg:"invalid credentials"});
})

function auth(req,res,next){
    const token=req.headers.token;
    try{
        const decode=jwt.verify(token,JWT_SECRET);
        if(!decode)
            res.json({msg:"empty token"});
        else
        {
            req.username=decode.username;
            next();
        }
    }
    catch(e){
        res.json({msg:"invalid token"});
    }
}
app.get("/about",auth,(req,res)=>{
    res.json({username:req.username});
})

app.listen(3000);