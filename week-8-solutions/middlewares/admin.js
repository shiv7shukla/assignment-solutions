const jwt=require("jsonwebtoken");
const JWT_ADMIN_PWD=process.env.JWT_ADMIN_PWD;

function AdminMiddleware(req,res,next){
    const token=req.headers.token;
    if (!token)
        return res.status(401).json({ msg: "Token not provided" });
    try{
        const decode=jwt.verify(token,JWT_ADMIN_PWD);
        if(decode)
        {
            req.id=decode.id;
            next();
        }
    }
    catch(e)
    {
        return res.status(403).json({msg:"invalid or expired token"});
    }
}

module.exports={AdminMiddleware};