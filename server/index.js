const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const path = require('path')
const UserModel = require('./models/UserModel')
const PostModel = require('./models/PostModel')


const app = express()
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
app.use(cookieParser())
app.use(express.static('public'))

mongoose.connect('mongodb://127.0.0.1:27017/blog');

// jwt token
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json("this token is missing")
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json("the token is wrong")
            } else {
                req.email = decoded.email;
                req.username = decoded.username;
                next()
            }
        })
    }
}

// api get
app.get('/', verifyUser, (req, res) => {
    return res.json({ email: req.email, username: req.username })
})


// api post  register///
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    bcrypt.hash(password, 10)
        .then(hash => {
            UserModel.create({ username, email, password: hash })
                .then(user => res.json(user))
                .catch(err => res.json(err))


        })

})
// api post login/////

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, response) => {
                    if (response) {
                        const token = jwt.sign({ email: user.email, username: user.username },
                            "jwt-secret-key", { expiresIn: '1d' })
                        res.cookie('token', token)
                        return res.json("Success")
                    } else {
                        return res.json("Password is incorrect");
                    }
                })

            } else {
                res.json("User not exist")
            }
        })
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/Images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }

})
const upload = multer({
    storage: storage
})
//  api post create
app.post('/create', verifyUser, upload.single('file'), (req, res) => {
    PostModel.create({
        title: req.body.title,
        description: req.body.description,
        file: req.file.filename,
        email: req.body.email
    })
        .then(result => res.json("Success"))
        .catch(err => res.json(err))
})

// app.get('/getposts',(req,res)=>{
//     // res.clearCookie('token')

//     const users = PostModel.findOne()

//     return res.json(users)
// })

//  api get getposts//
app.get('/getposts', async (req, res) => {
    try {
        const posts = await PostModel.find(); // Find all posts
        return res.json(posts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


// api getpostbyid
app.get('/getpostbyid/:id', (req, res) => {
    const id = req.params.id;
    PostModel.findById(id)
        .then(post => res.json(post))
        .catch(err => console.log(err));
});
// api editpost

app.put('/editpost/:id', (req, res) => {
    const id = req.params.id;
    PostModel.findByIdAndUpdate({ _id: id }, {
        title: req.body.title,
        description: req.body.description
    }
    ).then(result => res.json('Success'))
        .catch(err => res.json(err))
})

// api deletepost
app.delete('/deletepost/:id', (req, res) => {
    PostModel.findByIdAndDelete({ _id: req.params.id })
        .then(result => res.json("Success"))
        .catch(err => res.json(err))
})


// api get logout
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json("Success")
})



app.listen(3001, () => {
    console.log("Server is Running")
})