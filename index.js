var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan'); //keep log
var mongoose = require('mongoose');
var path = require('path');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config.js'); // get our config file
//var User   = require('./models/User'); // get our mongoose model //1
var Users = require('./controllers/userController'); //2
var Posts = require('./controllers/postController');
var hash = require('./hash');
app.use('/src',express.static(__dirname +'/src'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


var port = process.env.PORT || config.port; // used to create, sign, and verify tokens
var hostname = config.hostname;

mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable==key value

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json()); //initialize ดึงparameter ออกจาก req

// use morgan to log requests to the console
app.use(morgan('dev'));

app.get('/', function (req, res) {
    // res.send('Root URL'); //ถ้าไม่มี Index จะแสดง Root URL
    Users.getIndex(req, res);

});

app.get('/user', function (req, res) {
    // res.send('/api/users endpoint'); //1
    Users.getUser(req, res);
});
app.get('/user/:id', function (req, res) {
    //res.send('/api/users/'+ req.params.id);//1  //id = ขื่อตัวแปรตรง /api/users/:id <--
    var id = req.params.id;
    Users.getUserById(id, function (err, user) {
        if (err) throw err;
        res.json(user);
    });
});

app.post('/user/signup', function (req, res) {
    Users.signup(req, res);
});
app.post('/login', function (req, res) {
    Users.login(req, res);
});
app.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Invalid token.' });
            } else {
                req.decoded = decoded; // add decoded token to request obj.
                next(); // continue to the sensitive route
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});
app.post('/user', function (req, res) {
    Users.add(req,res);
    
});
app.put('/user/:id', function (req, res) {
    //res.send('/api/users/'+ req.params.id);//1  //id = ขื่อตัวแปรตรง /api/users/:id <--
    Users.update(req, res);
});
app.delete('/user/:id', function (req, res) {
    //res.send('/api/users/'+ req.params.id);//1  //id = ขื่อตัวแปรตรง /api/users/:id <--
    Users.remove(req, res);
});

app.get('/api/users', function (req, res) {
    // res.send('/api/users endpoint'); //1
    //Users.getUsers(req,res);//2
    Users.getUsers(function (err, users) { //แบบ controller มี limit
        if (err) throw err;
        res.json(users);
    }, 10); //limit ==10 จำกัดจำนวนหา
});

app.get('/api/users/:id', function (req, res) {
    //res.send('/api/users/'+ req.params.id);//1  //id = ขื่อตัวแปรตรง /api/users/:id <--
    var id = req.params.id;
    Users.getUserById(id, function (err, user) {
        if (err) throw err;
        res.json(user);
    });
});

app.get('/api/users/oid/:oid', function (req, res) { //obj. id
    res.send('/api/users/oid/' + req.params.oid);
});

app.get('/api/posts', function (req, res) {
    //res.send('/api/posts endpoint'); //1
    //Users.postUsers(req,res);//2
    Posts.getPosts(function (err, posts) {
        if (err) throw err;
        res.json(posts);
    }, 20);
});

app.get('/api/posts/:id', function (req, res) {
    // res.send('/api/posts/'+ req.params.id);
    var pid = req.params.id;
    Posts.getPostById(pid, function (err, post) {
        if (err) throw err;
        res.json(post);
    });
});

app.get('/api/posts/user/:id', function (req, res) { //หา เฉพาะ userId
    // res.send('/api/posts/'+ req.params.id);
    var uid = req.params.id;
    Posts.getPostByUid(uid, function (err, post) {
        if (err) throw err;
        res.json(post);
    });
});

app.listen(port, hostname, () => {
    console.log('Magic happens at http://localhost:' + port);
});
