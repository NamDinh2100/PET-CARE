import express from 'express';
import { engine } from 'express-handlebars';
import expressHandlebarsSections from 'express-handlebars-sections';
import session from 'express-session';
import { isAuth, isAdmin, isCustomer, isVeterinarian } from './middlewares/auth.mdw.js';

import path from 'path';
import { fileURLToPath } from 'url';

// USER ROUTER
import customerRouter from './routes/customer.route.js'


// ADMIN ROUTER
import accountRouter from './routes/account.route.js';
import employeeRouter from './routes/admin-employee.route.js';
import serviceRouter from './routes/admin-service.route.js';
import appointmentRouter from './routes/admin-appointment.route.js';
import userRouter from './routes/admin-customer.route.js';
import medicineRouter from './routes/admin-medicine.route.js';
import statisticRouter from './routes/admin-statistical.route.js';


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
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    
    partialsDir: [
        path.join(__dirname, 'views/vwAdmin'),
        path.join(__dirname, 'views/vwCustomer'),
        
        path.join(__dirname, 'views/vwVeterinarian/vwAppointment')
    ],
    
    helpers: {
        formatDate(date) {
            return new Date(date).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        },
        eq(a, b) {
            return a === b;
        },
        // Helper section (viết trực tiếp, không cần thư viện express-handlebars-sections)
        section: expressHandlebarsSections()
    }
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
  res.locals.serviceList = req.session.serviceList ? req.session.serviceList : null;
  res.locals.pets = req.session.pets ? req.session.pets : null;

  next();
});

// Customer Routers


app.use('/account', isAuth, isCustomer, customerRouter);

// Admin Routers
app.use('/admin/customers', isAuth, isAdmin, userRouter);
app.use('/admin/medicines', isAuth, isAdmin, medicineRouter);
app.use('/admin/employees', isAuth, isAdmin, employeeRouter);
app.use('/admin/appointments', isAuth, isAdmin, appointmentRouter);
app.use('/admin/services', isAuth, isAdmin, serviceRouter);
app.use('/admin/statistical', isAuth, isAdmin, statisticRouter);

app.use('/', accountRouter);

// Route xử lý lỗi 403
app.use((req, res) => {
    res.status(403).render('403');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/signin`);
});