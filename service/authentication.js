const jwt = require("jsonwebtoken");
const secret = "blogify123";

function createtokenforuser(user) {
    if (!user || !user.id || !user.email) {
        throw new Error('Invalid user data for token creation');
    }

    const payload = {
        id: user.id,
        email: user.email,
        profileimage: user.profileimage,
        role: user.role,
    };

    try {
        const token = jwt.sign(payload, secret, );
        return token;
    } catch (error) {
        throw new Error('Error creating token: ' + error.message);
    }
}

function validatetoken(token) {
    if (!token) {
        throw new Error('No token provided');
    }

    try {
        const payload = jwt.verify(token, secret);
        return payload;
    } catch (error) {
        throw new Error('Invalid token: ' + error.message);
    }
}

module.exports = {
    createtokenforuser,
    validatetoken,
};




