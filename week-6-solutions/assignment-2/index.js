const express=require("express");
const app=express();

const jwt=require('jsonwebtoken');
const JWT_SECRET="anything";

const{z}=require("zod");

const users=[],todos=[];

app.use(express());

app.post("/signup",(req,res)=>{
    const required=z.object({
        email:z.email().string().min(3).max(100),
        password:z.string().min(3).max(100),
        name:z.string().min(3).max(100)
    })
    if(!((required.safeParse(req.body)).success))
        res.json({msg:"incorrect credentials"});
    else
    {
        const username=req.body.username;
        const password=req.body.password;
        const name=req.body.name;
        users.push({name,username,password});
        res.json({msg:"you are signed up"});
    }
})

app.post("/signin",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    if(users.find(u=>u.username===username&&u.password===password))
    {
        const token=jwt.sign({username},JWT_SECRET);
        res.json({msg:"sign in successfully",token});
    }
    else
        res.json({msg:"invalid credentials"});
})

function auth(req,res,next)
{
    const token=req.headers.token;
    try
    {
        const decode=jwt.verify(token,JWT_SECRET);
        if(!decode)
            res.json({msg:"empty token"});
        else
            req.username=decode.username;
        next();
    }
    catch(e)
    {
        res.json({msg:"invalid token"});
    }
}