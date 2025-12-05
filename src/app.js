import express from 'express';
import { engine } from 'express-handlebars';
import expressHandlebarsSections from 'express-handlebars-sections';
import session from 'express-session';

import accountRouter from './routes/account.route.js';
import productRouter from './routes/product.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('handlebars', engine ({
    helpers: {
        section: expressHandlebarsSections()
    }
}))

app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(session( {
    secret: process.env.KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}))

app.use(function (req, res, next) {
  res.locals.isAuth = req.session.isAuth;
  res.locals.authUser = req.session.authUser;
  next();
});

app.use('/static', express.static('static'));
app.use(express.urlencoded( {
    extended: true
}))

app.get('/', function (req, res) {
    res.render('');
})

app.use('/account', accountRouter);
app.use('/products', productRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/account/signup`);
});