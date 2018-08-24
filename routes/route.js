let express = require('express');
let passport1 = require('passport');
let router = express.Router();


router.route('/google/callback')
    .get(passport1.authenticate('google', { 
        successRedirect: '/dashboard/',
        failure: '/error/'
}));


router.route('/google')
    .get(passport1.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email']
}));

module.exports = router;