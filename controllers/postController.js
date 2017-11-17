var mongoose=require('mongoose');
//var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config.js'); // get our config file
var Post   = require('../models/Post');

exports.getPosts = function(callback,limit){ //แบบที่ 2
    //limit==#ที่จะ show
    Post.find( callback ).limit(limit);
};

exports.getPostById=function(pid,callback){
    Post.find({id: pid},callback);
};

exports.getPostByUid=function(uid,callback){
    Post.find({userId: uid},callback);
};


