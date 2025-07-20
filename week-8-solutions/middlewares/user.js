const jwt=require("jsonwebtoken");
const JWT_USER_PWD=process.env.JWT_USER_PWD;

function UserMiddleware(req,res,next){
    const token=req.headers.token;
    const decode=jwt.verify(token,JWT_USER_PWD);
    if(decode)
    {
        req.id=decode.id;
        next();
    }
    else
        return res.status(403).json({msg:"you are not signed in"});
}

module.exports={UserMiddleware};