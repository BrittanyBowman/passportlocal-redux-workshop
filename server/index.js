const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const sessions = require('express-session');
const massive = require('massive');
const bcrypt = require('bcrypt');

//connect string to db
const connectionString = 'postgres://qgbgmadpafxbxv:00a3fe0736d3aac185a909e75f6853b65e1f8d5c06ab701c462b4ea26948f011@ec2-174-129-10-235.compute-1.amazonaws.com:5432/dcrvq5cto7816a?ssl=true'


const app = express();
app.use(bodyParser.json());

//Database connection
massive(connectionString).then(dbInstance => {
    app.set('db', dbInstance);
    console.log('Database connected!')
}).catch(err => {
    console.log(err);
});

//Setup Session
app.use(sessions({
    saveUninitialized: false,
    resave: false,
    secret: "shhh it's a secret"
}));

//Passport Setup
app.use(passport.initialize());
app.use(passport.session());


passport.use('login', new LocalStrategy(function (username, password, done) {
    //check to make sure usernamer and password exist
    if (username.length === 0 || password.length === 0) {
        return done(null, false, { message: 'Usernameand Password are required' });
    };
    //capture db instance
    const db = app.get('db');
    //find the user in the database
    db.users.find({ username }).then(userInfo => {
        //capture user info
        const user = userInfo[0];
        //remove the users password before sending back to client
        delete user.password
        done(null, user);
    }).catch(error => {
        console.log(error.message);
    })
}));

passport.use('register', new LocalStrategy(function(username, password, done){
    //check to make sure username and passowrd
    if(username.length === 0 || password.length === 0){
        return done(null, false, {message: "Username and Password are requirewd"});
    }
    //capture db instance
    const db = app.get('db');
    //hash the new users password
    const hashedPassword = bcrypt.hashSync(password, 15);

    db.users.find({username}).then(userInfo => {
        //check to make sure username is not already taken
        if(userInfo.length > 0){
            return done(null, false, {message: "Username is not available"});
        }
        //create the user if username is available
        return db.create_user([username, hashedPassword]);
    }).then((user) => {
        //remove the users passowrd before sending to the client
        const newUser = user[0];
        delete newUser.password;
        done(null, newUser);
    }).catch(error => {
        console.log(error.message)
    })
}))
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    done(null, id);
});


//Endpoints
app.post('/auth/login', passport.authenticate('login'), (req, res) => {
    const { user } = req;
    res.send(user);
});
app.post('/auth/register', passport.authenticate('register'), (req, res) => {
    const { user } = req;
    res.send(user);
})


app.listen(3002, () => {
    console.log('connected dawg!')
});