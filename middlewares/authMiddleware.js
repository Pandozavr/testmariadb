//если для эндпоинта использовать данную прослойку, то обращаться к ней сможет только авторизованный пользователь
//то есть с живым аксес токеном

const ApiError = require("../exeptions/apiError");
const tokenService = require("../service/token_service");

module.exports = function (req,res,next) {
    try{
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader) {
            return next(ApiError.UnauthorizedError())
        }
        const accessToken = authorizationHeader.split(" ")[1];
        if(!accessToken) {
            return next(ApiError.UnauthorizedError())
        }
        const userData = tokenService.validateAccessToken(accessToken)
        if(!userData) {
            return next(ApiError.UnauthorizedError())
        }
        req.user = userData;
        next();
    }catch (e) {
        return next(ApiError.UnauthorizedError())
    }
};