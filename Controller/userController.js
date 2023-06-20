const { UserModel,BookModel } = require("../MongoModel/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { deleteModel } = require("mongoose");

const passHash = async(password)=>{
  try {
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    return hashPassword;
  } catch (error) {
    console.log(error);
  }
}

const comparePass = (password, hashPass)=>{
  return bcrypt.compare(password, hashPass);
}

const signup = async (req, res) => {
  console.log("Signup is called..");

  const { name, email, password, phone } = req.body;
  try {
    // Validating Inputs
    if (!name || !email || !password || !phone) {
      res
        .status(401)
        .send({ message: "Please enter complete details to signup" });
    }

    // Checking existing user
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User is already registered, please sign in",
      });
    }

    const hashPass = await passHash(password);

    // Saving user in DB
    const user = await new UserModel({
      name,
      email,
      password: hashPass,
      phone,
    }).save();
 return res.json({status:"ok"})
    // res.status(200).send({
    //   success: true,
    //   message: "User SignedUp successfully",
    // });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Some error occurred while performing signup")
    // res
    //   .status(500)
    //   .send({ message: "Some error occurred while performing signup" });
  }
};
const login = async (req,res)=>{
    const {email,password}=req.body;
    const user = await UserModel.findOne({email});
    if(!user){
        return res.json({status:"error"})
    }
    const checkpassword = await bcrypt.compare(password, user.password);
    if(checkpassword){
        const token = jwt.sign({email: user.email},process.env.JWT_SECRET, {
            expiresIn:60,
        })
        
        return res.json({status:"ok", data:token})
    }else{
        return res.json({status:"error"})
    }
    
}

// const login = async(req, res)=>{
//   console.log("login is called..");
//   const { email, password } = req.body;
//   console.log(email);
//   try {
//     if(!email || !password){
//       return res.status(401).send({status: "Please enter complete details to login"})
//     }

//     const userFound = await UserModel.findOne({email: email});
//     if(!userFound){
//       return res.status(404).send({message: "User is not registered, signup first"});
//     }

//     // console.log("hashed password", userFound.password);
//     const isSamePass = await comparePass(password, userFound.password);
//     if(!isSamePass){
//       return res.status(401).send({status: "Invalid email or password, please try again"});
//     }

//     var token = jwt.sign({ id: userFound._id }, process.env.JWT_SECRET, { expiresIn: 20 });
//     console.log(token);

//     res.status(200).send({
//       success: true,
//       status: "User loggedIn successfully",
//       user: {
//         name: userFound.name,
//         email: userFound.email,
//         phone:userFound.phone,
//       },
//       token
//     })

//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       status: "Some error occurred while logging in",
//       error
//     })
//   }
//   // res.setHeader('Authorization', `Bearer ${token}`);
// }


const bookDemo = async (req,res)=>{
    const {name,email,phone,organisation,known} = req.body;
    const user = await UserModel.findOne({email});
    if(!user){
       return res.json("This email is not registered. if you not signup to OnGrid you can't book a demo please signup")
    }
    try{
        const bookdemoobj = new BookModel({
            name,
            email,
            phone,
            organisation,
            known
        })
        const bookinsert = await bookdemoobj.save();
        
        return res.status(200).json("demo booked").send(bookinsert)
    }
    catch(err){
        console.log(err)
        return res.status(500).send("something went wrong")
    }
}
// const bookDemo = async(req, res) =>{

//   const { name, email, phone, organisation, known } = req.body;

//   const userFound = await UserModel.findOne({ email: email });
  
//   try {
//     if (!userFound) {
//     return res.status(404).send({message: "User is not registered, signup first"});
//   }
//     if(!name || !email || !phone || !organisation || !known){
//       return res.status(401).send("Please enter all the deatils");
//     }
//     const demoUser = await new BookModel({
//       name,
//       email,
//       phone,
//       organisation,
//       known
//     }).save(); 
//              res.status(200).send({
//            success: true,
//             message: "User Demobooking successful",
//     });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send({message: "Something went wrong"});
//   }
//   res.send({message: "Protected route"});
// }
const userdetails= async (req,res)=>{
  const { token } = req.body;
  console.log(token)
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET, (err,res)=>{
            if(err){
                return "token expired";
            }
            return res;
        });
        if(user=="token expires"){
            return res.json({status: "error", data:"token expired"})
        }
        const useremail = user.email;
        UserModel.findOne({email: useremail})
        .then((data)=>{
            res.send({status: "ok", data: data});
        })
        .catch((error)=>{
            res.send({status: "error", data: data});
        })
    } catch (error) {
        
    }
}

module.exports = {
  signup,
  login,
  bookDemo,
  userdetails
};
