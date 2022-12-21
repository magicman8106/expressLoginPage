const mysql=require('mysql');
const express=require('express');
const session=require('express-session');
const path=require('path');
//above sets constants to their appropriate dependency library

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: 'root',
    database: 'nodelogin'
}) // creates connection with local mySQL server

const app=express();
//uses express as the app

app.use(session({
    secret:'secret',
    resave: 'true',
    saveUninitialized: true,
})); 
//using express-sessions idk what that is but look it up. It just determines whether the user is logged in or not 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
//associate modules that we are going to use
// the below comments are important for some fuck shit reason, the following comment adds the route\

// http://localhost:3000/
app.get('/', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/login.html'));
});// this is the login route for the login page. When a new connection is made we send he login page

//http://localhost:3000/auth
app.post('/auth',function(request,response) //method to post the login info 
{
    console.log('starting the post');
    let username=request.body.username;
    let password=request.body.password;
    console.log(username + " " +password)
    //grabs user input from request
    if(username&&password)
    {
        //query the DB  on the accounts table where user name and pw match a table input
        connection.query('SELECT * FROM accounts WHERE username=? AND password=?',[username, password],function(error,results , fields){
            if(error) throw(error);

            if(results.length > 0)
            {
                request.session.loggedin=true;
                request.session.username=username;

                response.redirect('/home');
            }
            else{
                response.send('Incorrect Username and/or Password');
            }
            response.end();
        });
    
    }
    else{
        response.send('Please Enter a Username and Password!');
        console.log(username + " "+password)
        response.end();
    }
});

// http://localhost:3000/home
app.get('/home',function(request, response)
{
    if(request.session.loggedin)
    {
        response.send('Welcome back '+request.session.username + '!');

    }
    else{
        response.send('Please login to view this page');
    }
    response.end();
});

app.listen(3000);