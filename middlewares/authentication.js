const { validatetoken } = require("../service/authentication");

function checkforauthentcationcookie(cookiename){
    return(req , res , next)=>{
        const tokencookievalue = req.cookies[cookiename];
        if(!tokencookievalue){
            return next();
        }
        try {
            const userpayload = validatetoken(tokencookievalue);
            req.user = userpayload;
            next();
        } catch (error) {
            console.log(error);
            req.user = null;
            next();
        }
    };
}

module.exports = {
    checkforauthentcationcookie
}