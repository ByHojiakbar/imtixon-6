const { globalError, ClientError } = require("shokhijakhon-error-handler");
const { parseAccessToken } = require("../lib/jwt.service");

module.exports = async(req ,res ,next)=> {
try {
const auth = req.headers.authorization;
if(!auth) throw new ClientError("Unauthorized", 401);
const tokenType = auth.split(" ")[0];
const accessToken = auth.split(" ")[1];
if(tokenType != "Bearer"|| !accessToken)  throw new ClientError("Token invalid", 401)
const payload = parseAccessToken(accessToken);
req.user = payload
return next()
} catch (err) {
    if(err.name == "TokenExpiredError") return res.json({
     message :"AccessToken expired",
     status: 401
    })
    return globalError(err, res)
}
}