const express=require("express");
const app=express();

const jwt=require('jsonwebtoken');
const JWT_SECRET="anything";

const{z}=require("zod");

const users=[],todos=[];

app.use(express.json());

app.post("/signup",(req,res)=>{
    const required=z.object({
        name:z.string().min(3).max(100),
        password:z.string().min(3).max(100),
        username:z.string().min(3).max(100)
    })
    if(!((required.safeParse(req.body)).success))
        return res.json({msg:"incorrect credentials"});
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
    const required=z.object({
        password:z.string().min(3).max(100),
        username:z.string().min(3).max(100)
    })
    if(!((required.safeParse(req.body)).success))
        return res.json({msg:"incorrect credentials"});
    else
    {
        const username=req.body.username;
        const password=req.body.password;
        if(users.find(u=>u.username===username&&u.password===password))
        {
            const token=jwt.sign({username},JWT_SECRET);
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
            req.username=decode.username;
        next();
    }
    catch(e)
    {
        res.json({msg:"invalid token"});
    }
}

app.get("/my-todos",auth,(req,res)=>{
    const username=req.username;
    const todo=todos.filter(u=>u.username===username);
    res.json({todo});
})

app.post("/add-todo",auth,(req,res)=>{
    const title=req.body.title;
    const username=req.username;
    if(!title)
        res.json({msg:"todo title is empty"});
    else
    {
        todos.push({
            id:todos.length+1,
            username,
            title,
            done:false
        });
        res.json({msg:"todo added"});
    }
})

app.put("/done/:id",auth,(req,res)=>{
    const {id}=req.params;
    const {title}=req.body;
    const username=req.username;
    if(!id||!title||!username)
        res.json({msg:"something is missing"});
    else
    {
        const found=todos.find(t=>t.username===username&&t.id===parseInt(id)&&t.title===title);
        if(!found)
            res.json({msg:"todo not found"});
        else
        {
            found.done=!found.done;
            res.json({msg:`todo marked as ${found.done?"done":"not done"}`});
        }
    }
})

app.delete("/delete/:id",auth,(req,res)=>{
    const {id}=req.params;
    const {title}=req.body;
    const username=req.username;
    if(!id||!title||!username)
        res.json({msg:"something is missing"});
    else
    {
        const index=todos.findIndex(t=>t.username===username&&t.id===parseInt(id)&&t.title===title);
        if(index==-1)
            return res.json({msg:"todo not found"});
        else
            todos.splice(index,1);
        res.json({msg:"todo deleted successfully"});
    } 
})

app.listen(3000);