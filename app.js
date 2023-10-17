const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

app.use(express.urlencoded( { extended: true } ));
app.use(express.static('public'));
app.use(expressLayouts);

app.use(cookieParser('CookingBlogSecure'));
app.use(session({
    secret: 'CookingBlogSecretSession',
    saveUninitialized: true,
    resave: true
}));
app.use(flash());
app.use(fileUpload());


// uses a layout file for rendering views, and it's specifying that the layout file is located at "./layouts/main.ejs"
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// requires the routes writen in recipeRoutes.js and stores in the variable called routes so that it is easy to use in this file
const routes = require('./server/routes/recipeRoutes.js');
// refered from the variable routes for '/'
app.use('/', routes);

app.listen(port, () => console.log(`Listening to port ${port}`));