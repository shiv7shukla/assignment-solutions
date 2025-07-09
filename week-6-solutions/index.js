const express=require("express");
const app=express();

app.use(express.json());

const jwt=require("jsonwebtoken");
const JWT_SECRET="anything";

const users=[];

app.post("/signup", (req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    if(users.find(u=>u.username===username && u.password===password))
        res.json({msg:"you have already signed up"});
    else
        users.push({username, password});
    res.json({msg:"signed up successfully"});    
});

app.post("/signin", (req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    if(!(users.find(u=>u.username===username && u.password===password)))
        res.json({msg:"invalid credentials"});
    else
    {
        const token=jwt.sign(username, JWT_SECRET);
        res.json({msg:"signed in successfully", token});
    }
});

function auth(req,res,next){
    const token=req.headers.token;
    if(!token)
        res.json({msg:"missing token"});
    else
    {
        try{
            const decode=jwt.verify(token, JWT_SECRET);
            if(!token)
                res.json({msg:"token missing"});
            else
                req.username=decode;
        }
        catch(e)
        {
            res.json({msg:"invalid token"});
        }
    }
    next();
}

app.get("/about", auth, (req,res)=>{
    res.json({username: req.username});
});

app.listen(3000);