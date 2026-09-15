const validator = require("validator");

function registerValidation(data){
    const mandatoryfields=["username", "name" ,"email","password"];
    const isallowed = mandatoryfields.every((key)=> Object.keys(data).includes(key));
    // if(!isallowed) throw new Error("fill all fields");
    // if(!(validator.isEmail(data.emailId))) {
    //         throw new Error("Invalid email");
    // }
    if(!isallowed) return false;
    if(!(validator.isEmail(data.email))) return false;

    return true;
}
module.exports = registerValidation;