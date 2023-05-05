const validator = require("validator");
const jwt=require("jsonwebtoken")
const nodemailer=require("nodemailer")
//const SECRETKEY="This is our secret key"
require('dotenv').config();


/**
 * @function - cleaning the data for registration
 * @param {email : String, username, name, password: Boolean}
 * @returns  - return a promise either resolve or reject with errors
 */
const cleanupAndValidate = ({ email, username, name, password }) => {
  return new Promise((resolve, reject) => {
    if (!email || !username || !name || !password) {
      reject("Missing Credentials");
    }

    if (typeof email !== "string") reject("Invalid Email");
    if (typeof username !== "string") reject("Invalid Username");
    if (typeof password !== "string") reject("Invalid Password");

    if (username.length <= 2 || username.length > 50) {
      reject("username should be 3-50 charachters");
    }
    if (password.length <= 2 || username.password > 50) {
      reject("password should be 3-20 charachters");
    }

    if (!validator.isEmail(email)) {
      reject("Invalid Email Format");
    }

    resolve();
  });
};

const generateJWTToken=(email)=>{
  const token=jwt.sign(email,process.env.SECRET_KEY);
  return token;
}

const sendVerificationToken=({email,token})=>{

  const transporter=nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    service:"gmail",
    auth:{
      user:process.env.AUTH_EMAIL,
      pass:process.env.AUTH_PASSWORD
    }
  })

  const mailOptions={
    from:"vinitkarki29797@gmail.com",
    to:email,
    subject:"Email verification for Todo App",
    html:`Click <a href="http://localhost:8000/api/${token}">Here</a>`
  }

  transporter.sendMail(mailOptions,function(error,info){
    if(error){
      console.log(error);
    }
    else{
      console.log("Email sent successfully"+info.response);
    }
  })

}

module.exports = { cleanupAndValidate,generateJWTToken,sendVerificationToken };
