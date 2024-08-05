import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";

// Create a new user

const saltRounds = 10;


function isEmpty(value) {
  if (value == null) {
    return true;
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }
  
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  
  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return true;
  }
  
  return false;
}

// Function to check if any value in an object is empty
function anyValueIsEmpty(obj) {
  for (let key in obj) {
    console.log(key+ obj[key])
    if (obj.hasOwnProperty(key) && isEmpty(obj[key])) {
    console.log('retunrd')

      return true; // Found an empty value
    }
  }
  return false; // No empty values found
}

export const registerUser = async (req, res, next) => {
  try {
    const { email, username, password, confirm_pass } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({
        message: "please provide all fields",
      });
    }

    if (password!== confirm_pass) {
      return res.status(400).json({
        message: "passwords dont match",
      });
    }

    const user_exists = await User.findOne({ where: { email: email, username: username } });

    if (user_exists){
      return res.status(400).json({
        message: "user already exist try with a different username or email"
      })
    }
  
    const encrypted_pass = await bcrypt.hash(password, saltRounds);

    console.log(encrypted_pass);



    const user = await User.create({
      email: email,
      username: username,
      password: encrypted_pass,
    });

    console.log("Registration success " + user);
    return res.status(201).json({
      message: "User created successfully",
      userId: user.id,
    });
  } catch (error) {
    res.status(500).json({
      message: "An exception occurred",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide all fields",
      });
    }

    let user = await User.findOne({ where: { email: email } });

    if (user == null) {
      return res.status(400).json({
        message: "No user by email found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(403).json({
        message: "Invalid password",
      });
    }

    let token = jwt.sign(
      { email: user.email, username: user.username },
      process.env.secretKey,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "User validated",
      user_token: token,
    });
  } catch (error) {
    res.status(500).json({
      message: "An exception occurred",
      error: error.message,
    });
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();

    if (users.length === 0) {
      return res.status(400).json({
        message: "No user found",
      });
    }

    return res.status(200).json({
      message: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "An exception occurred",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res, next) => {
  try {
    let content = req.body;

    console.log(content)

    if (!content.hasOwnProperty('id')) {
      return res.status(400).json({
        message: "id is required field",
      });
    }

    if (anyValueIsEmpty(content)) {
      console.log("null value found")
      return res.status(400).json({
        message: "fields cannot be empty",
      });
    }

    console.log("api hit")

    if (content.password){
      const encrypted = await bcrypt.hash(content.password, saltRounds);
      content = {...content, password:encrypted}
    }
    

    let user = await User.findOne({ where: { id: content.id } });

    if (user == null) {
        return res.status(400).json({
          message: "No user by id found",
        });
      }

    await user.update(content);

    return res.status(200).json({
      message: "user updated sucessfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "An exception occurred",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(500).json({
        message: "no user info available",
      });
    }

    let user = await User.findOne({ where: { id: id } });

    if (user == null){
        return res.status(400).json({
            message: "no user by id found"
        })
    }

    await user.destroy();


      return res.status(200).json({
        message: "user deleted sucessfully",
      });
 
  } catch (error) {
    res.status(500).json({
      message: "An exception occurred",
      error: error.message,
    });
  }
};
