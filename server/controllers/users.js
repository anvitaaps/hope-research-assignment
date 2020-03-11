const UserList = require('../models/List');
// user login API*********************************
const express = require('express');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const expressJwt = require('express-jwt');
const router = express.Router();

router.post('/user-login', (req, res) => {
    console.log('body: ',req.body);
    
    var user_email_id = req.body.email;
    var user_password = req.body.password;
    var data = {
        email: req.body.email,
        password: req.body.password
    }
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(user_email_id) === false) {
        console.log('email: ', req.body);
        
        var result = {
            status: false,
            message: 'Please enter valid email address'
        };
        return res.status(200).send(result);
    }

    UserList.checkUser(data,(err, list) => {
        console.log(err, list);
        
        if(err) {
            res.json({success: false, message: `Failed to create a new list. Error: ${err}`});

        }
        else if(list) {
            var token = jwt.sign({userID: list.id, role: list.role}, 'todo-app-super-shared-secret', {expiresIn: '2h'});
            res.json({token: token, success:true, message: "Login successfully"});
        }
        else if (!list)
            res.json({success:false, message: "Invalid credentials"});
    });

});
//ENd user login**************************************

// jwt authentication
function generateToken(userId) {
    const payload = {
        user: userId
    };
    var token = jwt.sign(payload, secret, {
        expiresIn: '24h' // expires in 24 hours
    });
    console.log('Access Token Generated', token);
    return token;
}
exports.verifyAccessToken = function (token) {
    if (token) {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                console.log('Failed to verify access token', token);
                return false;
            } else {
                console.log('Verified Access Token ' + token + ' decode ' + decoded);
                return true;
            }
        });
    } else {
        console.log("Access token is not valid");
        return false;
    }
}

//GET HTTP method to /UserList
router.get('/getDetailsById/:id',(req,res) => {
    let id = req.params.id;
    UserList.findUserDetails(id, (err, lists)=> {
        console.log(err, lists);
        
        if(err) {
            res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
        }
        else {
            res.write(JSON.stringify({success: true, lists:lists},null,2));
            res.end();

    }
    });
});

//GET HTTP method to /UserList
router.get('/posts/:id',(req,res) => {
    let id = req.params.id;
    // console.log('decodeddddddddddddddd:',jwt_decode(req.headers.authorization));
    
    // check for basic auth header
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }
    UserList.findUserPosts(id, (err, lists)=> {
        console.log(err, lists);
        
        if(err) {
            res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
        }
        else {
            res.json({data: lists.posts, success:true, message: "Data fetched successfully"});
    }
    });
});

//GET HTTP method to /UserList
router.get('/getAllUsers',(req,res) => {
    // check for basic auth header
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }
    console.log('authorization: ', jwt_decode(req.headers.authorization).role);
    
    // check for author role
    if (jwt_decode(req.headers.authorization).role != 'admin') {
        return res.status(401).json({ message: 'Invalid User' });
    }

    UserList.getAllLists((err, lists)=> {
        // console.log(err, lists);
        
        if(err) {
            res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
        }
        else {
            res.json({data: lists, success:true, message: "Data fetched successfully"});
    }
    });
});

//GET HTTP method to /UserList
router.get('/getAllPosts',(req,res) => {
    // check for basic auth header
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }
    console.log('authorization: ', jwt_decode(req.headers.authorization).role);
    
    // check for author role
    if (jwt_decode(req.headers.authorization).role != 'admin') {
        return res.status(401).json({ message: 'Invalid User' });
    }

    UserList.getAllLists((err, lists)=> {
        // console.log(err, lists);
        
        if(err) {
            res.json({success:false, message: `Failed to load all posts. Error: ${err}`});
        }
        else {
            var posts = [];
            lists.map(item => {
                item.posts.map(item2 => {
                    posts.push(item2)
                })
            })
            res.json({data: posts, success:true, message: "Data fetched successfully"});
    }
    });
});

module.exports = router;