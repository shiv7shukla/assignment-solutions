const express=require("express");
const app=express();

const jwt=require('jsonwebtoken');
const JWT_SECRET="anything";

const{z}=require("zod");

const cors=require("cors");

const path = require('path');
app.use(express.static(__dirname));

const users=[],todos=[];

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post("/signup",(req,res)=>{
    const required=z.object({
        password:z.string().min(3).max(100),
        email:z.email()
    })
    const result=required.safeParse(req.body);
    if(!result.success)
        return res.json({msg:"incorrect credentials"});
    else
    {
        const email=req.body.email;
        const password=req.body.password;
        users.push({email,password});
        res.json({msg:"you are signed up"});
    }
})

app.post("/signin",(req,res)=>{
    const required=z.object({
        password:z.string().min(3).max(100),
        email:z.string().min(3).max(100)
    })
    if(!((required.safeParse(req.body)).success))
        return res.json({msg:"incorrect credentials"});
    else
    {
        const email=req.body.email;
        const password=req.body.password;
        if(users.find(u=>u.email===email&&u.password===password))
        {
            const token=jwt.sign({email},JWT_SECRET);
            return res.json({msg:"sign in successfully",token});
        }
        else
            res.json({msg:"invalid credentials"});
    }
})

function auth(req,res,next)
{
    const token=req.headers.token;
    try
    {
        const decode=jwt.verify(token,JWT_SECRET);
        if(!decode)
            return res.json({msg:"empty token"});
        else
            req.email=decode.email;
        next();
    }
    catch(e)
    {
        res.json({msg:"invalid token"});
    }
}

app.get("/my-todos",auth,(req,res)=>{
    const email=req.email;
    const todo=todos.filter(u=>u.email==email);
    res.json({todo});
})

app.post("/add-todo",auth,(req,res)=>{
    const title=req.body.title;
    const email=req.email;
    if(!title)
        res.json({msg:"todo title is empty"});
    else
    {
        todos.push({
            id:todos.length+1,
            email,
            title,
            done:false
        });
        res.json({msg:"todo added"});
    }
})

app.put("/done/:id",auth,(req,res)=>{
    const {id}=req.params;
    const {title}=req.body;
    const email=req.email;
    if(!id||!title||!email)
        res.json({msg:"something is missing"});
    else
    {
        const found=todos.find(t=>t.email===email&&t.id===parseInt(id)&&t.title===title);
        if(!found)
            res.json({msg:"todo not found"});
        else
        {
            found.done=!found.done;
            res.json({msg:`todo marked as ${found.done?"done":"not done"}`});
        }
    }
})

app.listen(3000);