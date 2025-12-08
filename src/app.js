import express from 'express';
import { engine } from 'express-handlebars';
import expressHandlebarsSections from 'express-handlebars-sections';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

import accountRouter from './routes/account.route.js';
import employeeRouter from './routes/admin-employee.route.js';
import veterinarianAppointmentRouter from './routes/appointment.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Lấy __dirname trong ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static
app.use('/static', express.static(path.join(__dirname, 'static')));

// Body parser
app.use(express.urlencoded({
  extended: true,
}));

// Handlebars engine
app.engine('handlebars', engine({
  defaultLayout: 'main',                                   // file views/layouts/main.handlebars
  layoutsDir: path.join(__dirname, 'views/layouts'),       // thư mục layouts
  partialsDir: [
    path.join(__dirname, 'views/vwAdmin/'),
    path.join(__dirname, 'views/components'),
    path.join(__dirname, 'views/shared'),
  ],
  partialsDir: path.join(__dirname, 'views/vwVeterinarian/vwAppointment'),     // 🎯 thư mục partials
  helpers: {
    section: expressHandlebarsSections(),
  },
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views')); 

app.use(session( {
    secret: 'pet-care-secret-key',
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


app.use('/account', accountRouter);

//app.use('/veterinarian/appointments', veterinarianAppointmentRouter);

// Admin Routers
//app.use('/admin/users', userRouter);
//app.use('/admin/medicines', medicineRouter);
app.use('/admin/employees', employeeRouter);
//app.use('/admin/services', serviceRouter);
//app.use('/admin/statistics', statisticRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/admin/employees`);
});