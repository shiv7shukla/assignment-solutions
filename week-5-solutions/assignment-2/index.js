const express=require("express")
const app=express();
app.use(express.json());
let requests=0;
function requestCount(req,res,next)
{
    requests++;
    next();
}
app.use(requestCount);
app.get("/",(req,res)=>res.json({message:"hello world"}));
app.post("/create",(req,res)=>res.json({message:"create something"}));
app.put("/update",(req,res)=>res.json({message:"update something"}));
app.delete("/delete",(req,res)=>res.json({message:"delete something"}));
app.get("/reqcount",(req,res)=>{res.json({totalnumberofrequests:requests})});
app.listen(3000);