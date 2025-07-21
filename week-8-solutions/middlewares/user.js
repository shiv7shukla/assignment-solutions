const jwt=require("jsonwebtoken");
const JWT_USER_PWD=process.env.JWT_USER_PWD;

function UserMiddleware(req,res,next){
    const token=req.headers.token;
        if (!token)
            return res.status(401).json({ msg: "Token not provided" });
        try{
            const decode=jwt.verify(token,JWT_USER_PWD);
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

module.exports={UserMiddleware};