const { UserModel,BookModel } = require("../MongoModel/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

    res.status(200).send({
      success: true,
      message: "User SignedUp successfully",
    });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .send({ message: "Some error occurred while performing signup" });
  }
};

const login = async(req, res)=>{
  console.log("login is called..");
  const {email, password} = req.body;
  try {
    if(!email || !password){
      return res.status(401).send({message: "Please enter complete details to login"})
    }

    const userFound = await UserModel.findOne({email: email});
    if(!userFound){
      return res.status(404).send({message: "User is not registered, signup first"});
    }

    // console.log("hashed password", userFound.password);
    const isSamePass = await comparePass(password, userFound.password);
    if(!isSamePass){
      return res.status(401).send({message: "Invalid email or password, please try again"});
    }

    const token = jwt.sign({id: userFound._id}, process.env.JWT_SECRET, {expiresIn: '2d'});

    res.status(200).send({
      success: true,
      message: "User loggedIn successfully",
      user: {
        name: userFound.name,
        email: userFound.email,
        phone:userFound.phone,
      },
      token
    })

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Some error occurred while logging in",
      error
    })
  }
  // res.setHeader('Authorization', `Bearer ${token}`);
}

const bookDemo = async(req, res) =>{

  const { name, email, phone, organisation, known } = req.body;

  const userFound = await UserModel.findOne({ email: email });
  
  try {
    if (!userFound) {
    return res.status(404).send({message: "User is not registered, signup first"});
  }
    if(!name || !email || !phone || !organisation || !known){
      return res.status(401).send("Please enter all the deatils");
    }
    const demoUser = await new BookModel({
      name,
      email,
      phone,
      organisation,
      known
    }).save(); 
             res.status(200).send({
           success: true,
            message: "User Demobooking successful",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({message: "Something went wrong"});
  }
  res.send({message: "Protected route"});
}

module.exports = {
  signup,
  login,
  bookDemo
};
