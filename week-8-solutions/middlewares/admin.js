const jwt=require("jsonwebtoken");
const JWT_ADMIN_PWD=process.env.JWT_ADMIN_PWD;

function AdminMiddleware(req,res,next){
    const token=req.headers.token;
    const decode=jwt.verify(token,JWT_ADMIN_PWD);
    if(decode)
    {
        req.id=decode.id;
        next();
    }
    else
        return res.status(403).json({msg:"you are not signed in"});
}

module.exports={AdminMiddleware};