const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.cookies.access_token;
        if(!token){
            return res.redirect('/admin/adminLogin')
        }
        console.log(token);
        // const decoded = jwt.verify(token, process.env.JWT_KEY);
        const decoded = jwt.verify(token, "secret");
        console.log(decoded);
        req.adminData = decoded;
        next();
    } catch(error){
        return res.status(401).render('loginSignup');
    }
}
