var mongoose = require('mongoose');
//var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config.js'); // get our config file
var User = require('../models/User');
var hash = require('../hash');
var jwt = require('jsonwebtoken');

/*exports.getUser = function (callback) { //แบบที่1
    User.find(callback);

};*/
exports.getIndex = function (req, res) {
    User.find((err, users) => { // Define what to do
        if (err) throw err; // when query finished.
        res.render('index', { // render ‘views/index.ejs’
            title: "Customer List:",
            users: users
        });
    });
};
exports.getUser = function (req, res) { //แบบที่ 2
    User.find((err, users) => { // Define what to do
        if (err) throw err; // when query finished.
        res.json(users);
    });

};
exports.getUsers = function (callback, limit) { //แบบที่ 2
    //limit==#ที่จะ show
    User.find(callback).limit(limit);
};

exports.getUserById = function (uid, callback) {
    User.find({ id: uid }, callback);
};


exports.add = function (req, res) {
    //response.redirect('/'); 
    User.find({}).sort({ id: -1 }).limit(1).exec((err, users) => {
        if (err) throw err;
        if (users && users.length != 0) {
            var newUser = new User({
                id: users[0].id + 1, // users is an array of User objects
                name: req.body.name,
                age: parseInt(req.body.age),
                email: req.body.email,
                
            });
            newUser.save(function (err, user) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Unable to add new user!',
                    });
                } else {
                    return res.json({
                        success: true,
                        message: 'New user has been created',
                        user: {
                            name: newUser.name,
                            email: newUser.email,
                            admin: newUser.admin
                        }
                    });
                }
            });
        } else {
            res.json({
                success: false,
                message: 'User cannot be added!'
            });
        }
    });
    console.log('New user has beed added.');
};
exports.signup = function (req, res) {
    var salt = hash.genRandomString(16);
    var pwd_data = hash.sha512(req.body.password, salt);
    // find a user with maximum id: find all users and sort by id max-to-min
    User.find({}).sort({ id: -1 }).limit(1).exec((err, users) => {
        if (err) throw err;
        if (users && users.length != 0) {
            var newUser = new User({
                id: users[0].id + 1, // users is an array of User objects
                name: req.body.name,
                age: parseInt(req.body.age),
                email: req.body.email,
                salt: pwd_data.salt,
                passwordhash: pwd_data.passwordHash,
                admin: req.body.admin ? req.body.admin : false
            });
            newUser.save(function (err, user) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Unable to add new user!',
                    });
                } else {
                    return res.json({
                        success: true,
                        message: 'New user has been created',
                        user: {
                            name: newUser.name,
                            email: newUser.email,
                            admin: newUser.admin
                        }
                    });
                }
            });
        } else {
            res.json({
                success: false,
                message: 'User cannot be added!'
            });
        }
    });
};
exports.update = function (req, res) { //แบบที่ 2
    User.update({id:req.params.id},req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send(err);
        res.status(200).send("User " + req.body.name + " was updated.");
    });

};

exports.remove = function (req, res) { //แบบที่ 2

    User.remove({ id: req.params.id }, function (err, user) {
        if (err) return res.status(500).send(err);
        res.status(200).send("User " + req.body.name + " was deleted.");
    });

};
exports.login = function (req, res) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {
            var passwdData = hash.sha512(req.body.password, user.salt);
            if (user.passwordhash != passwdData.passwordHash) {
                return res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            } else {
                const payload = {
                    id: user.id,
                    email: user.email,
                    admin: user.admin
                };
                var token = jwt.sign(payload, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                return res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        }
    });
};
