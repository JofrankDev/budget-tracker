const User = require("../models/User");
const jwt = require("jsonwebtoken");

//generar el token 

const generateToken = (id) => {

    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn: "1d"});
};

exports.registerUser = async (req, res) => {
    //console.log("METHOD:", req.method);
    //console.log("HEADERS:", req.headers);
   // console.log("BODY:", req.body);
    const {fullName , email, password, profileImageUrl} = req.body || {};
    

    if (!fullName || !email || !password) {
        return res.status(400).json ({ message: "Se requieren todos los campos."});
    }

    try {
        const  existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json ({ message: "Correo ya registrado."});
        }
    
    //registro de ususario

    const user = await User.create ({
        fullName,
        email,
        password,
        profileImageUrl,
    });

    res.status(201).json({
        id: user._id,
        user,
        token: generateToken(user._id),
    });
    }
    catch (err) {
        console.log(err);
        res
        .status(500)
        .json({message: "Ha Ocurrido un error registrando al usuario",
            error: err.message
        })
    };
};

exports.loginUser = async (req, res) => {
const {fullName , email, password, profileImageUrl} = req.body || {};
    

    if (!email || !password) {
        return res.status(400).json ({ message: "Se requieren todos los campos."});
    }

    try {
        const  user = await User.findOne({email});
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json ({ message: "Usuario o contrasena invalido"});
        }


    res.status(200).json({
        id: user._id,
        user,
        token: generateToken(user._id),
    });
    }
    catch (err) {
        console.log(err);
        res
        .status(500)
        .json({message: "Ha Ocurrido un error confirmando al usuario",
            error: err.message
        })
    };
};

exports.getUserInfo = async (req, res) => {
    try {
        const user =  await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({message: "Usuario no encontrado"});
        }

        res.status(200).json(user);
    }
    catch(err) {
        console.log(err);
        res
        .status(500)
        .json({message: "Ha Ocurrido un error buscando al usuario",
            error: err.message
        })
    };
};