var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcryptjs');

router.get("/", function(req, res){

    res.send("hello");

});

module.exports = router; 