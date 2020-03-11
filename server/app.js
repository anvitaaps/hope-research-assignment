// dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require("http");
// Connect mongoose to our database
const config = require('./config/database');
const UserList = require('./models/List');
mongoose.connect(config.database,function(){
    /* Drop the DB */
    mongoose.connection.db.dropDatabase();
});
//Initialize our app variable
const app = express();
var router = express.Router();
// var UserController = require('./controllers/users.js');
// router.post('/user_login', UserController.user_login);

var role = 'admin';
const request = require('request');
request('https://jsonplaceholder.typicode.com/users', function (error, response, body) {
    var arr = JSON.parse(response.body);
    arr.map( item => {
        role == 'admin' ? (role = 'viewer') : (role = 'admin');
        item['role'] = role;
        item['password'] = '1234'; 
        var user = new UserList(item)
        UserList.addList(user,(err, list) => {
            if(err) {
                console.log(err);
            }
            else {
                // console.log('Successfully added: ',list);
            }
               
        });
    })
});

request('https://jsonplaceholder.typicode.com/posts', function (error, response, body) {
    var arr = JSON.parse(response.body);
    arr.map( item => {
        // console.log('comment item: ', item);
        let newData = {
            postId : item.id,
            title : item.title,
            body : item.body
        }
        UserList.updateListByPosts(item['userId'], newData, (err,list) => {
            if(err) {
                // res.json({success:false, message: `Failed to update the list. Error: ${err}`});
            }
            else if(list) {
                // console.log('updated: ', list); 
            }
        })
    })
});

module.exports = router;

//Middleware for CORS
app.use(cors());

//Middlewares for bodyparsing using both json and urlencoding
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


/*express.static is a built in middleware function to serve static files.
 We are telling express server public folder is the place to look for the static files

*/
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req,res) => {
    res.send("Invalid page");
})

    
const user_login = require('./controllers/users');

//Routing all HTTP requests to /user to user controller
app.use('/user',user_login);

//Declaring Port
const port = 3000;

//Listen to port 3000
app.listen(port, () => {
    console.log(`Starting the server at port ${port}`);
});
