//Require mongoose package
const mongoose = require('mongoose');

//Define Userchema with title, description and category
const Userchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: String,
    username: String,
    email: String,
    password: String,
    role: String,
    posts: [ { postId: Number , title: String , body: String , comments: [ { name: String, body: String } ] }]
});

const UserList = module.exports = mongoose.model('UserList', Userchema );

//UserList.find() returns all the lists
module.exports.getAllLists = (callback) => {
    UserList.find(callback);
}

//newList.save is used to insert the document into MongoDB
module.exports.addList = (newList, callback) => {
    // console.log('new list: ', newList);
    
    newList.save(callback);
}

//Here we need to pass an id parameter to UserList.remove
module.exports.deleteListById = (id, callback) => {
    let query = {_id: id};
    UserList.remove(query, callback);
}

//Here we need to pass an id parameter to UserList.updateOne
module.exports.updateListByPosts = (id, newData,callback) => {
    // console.log('new updated data : ', newData, id);
    let query = {id: id};
    UserList.findOneAndUpdate(query, { $push : {"posts": newData }}, callback);
}

//Here we need to pass an id parameter to UserList.updateOne
module.exports.updatePostsByComments = (id, newData,callback) => {
    // console.log('new updated data : ', newData, id, UserList);
    var query  = UserList.where({ postId: id });
    UserList.findOneAndUpdate(query, { $push : {"comments": newData }}, callback);
} 

//Here we need to pass an id parameter to UserList.updateOne
module.exports.checkUser = (Data,callback) => {
    console.log('data: ', Data);
    
    var query  = UserList.where({ email: Data.email, password: Data.password });
    UserList.findOne(query, callback);
}

//Here we need to pass an id parameter to UserList.updateOne
module.exports.findUserDetails = (id,callback) => {
    var query  = UserList.where({ id: id });
    UserList.findOne(query, callback);
}

//Here we need to pass an id parameter to UserList.updateOne
module.exports.findUserPosts = (id,callback) => {
    var query  = UserList.where({ id: id });
    UserList.findOne(query, callback);
}
