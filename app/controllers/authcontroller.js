var exports = module.exports = {}
 
exports.signup = function(req, res) {
 
    res.render('signup');
 
}

exports.signin = function(req, res) {
 
    res.render('signin');
 
}

exports.dashboard = function(req, res) {
 
    res.render('dashboard');
 
}

exports.index = function(req, res) {
 
    res.render('index');
 
}

exports.about = function(req, res) {
 
    res.render('about');
 
}

exports.contact = function(req, res) {
 
    res.render('contact');
 
}

exports.features = function(req, res) {
 
    res.render('features');
 
}

exports.logout = function(req, res) {
 
    req.session.destroy(function(err) {
 
        res.redirect('/index');
 
    });
 
}