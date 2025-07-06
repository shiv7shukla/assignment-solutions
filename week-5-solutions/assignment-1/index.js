const express=require("express")
const app = express();
app.use(express.json());
function logger(req,res,next)
{
    const date=new Date();
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.url}`);
    console.log(`Host: ${req.host}`);
    console.log(`Protocol: ${req.protocol}`);
    console.log(`Timestamp: ${date.toLocaleString('en-IN')}`);
    next();
}
app.use(logger);
app.get("/",(req,res)=>res.json({message:"hello world"}));
app.post("/create",(req,res)=>res.json({message:"create something"}));
app.put("/update",(req,res)=>res.json({message:"update something"}));
app.delete("/delete",(req,res)=>res.json({message:"delete something"}));
app.listen(3000);