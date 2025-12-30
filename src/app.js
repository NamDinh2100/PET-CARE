import express from 'express';
import { engine } from 'express-handlebars';
import expressHandlebarsSections from 'express-handlebars-sections';
import session from 'express-session';
import { isAuth, isAdmin, isCustomer, isVeterinarian } from './middlewares/auth.mdw.js';

import path from 'path';
import { fileURLToPath } from 'url';

// COMMON ROUTER
import accountRouter from './routes/commonRoute/account.route.js';
import profileRouter from './routes/commonRoute/profile.route.js';

// USER ROUTER
import petCustomerRouter from './routes/customerRoute/pet.route.js'
import appointmentCustomerRouter from './routes/customerRoute/appointment.route.js'

// VERTERINARIAN ROUTER
import vetScheduleRouter from './routes/vetRoute/schedule.route.js';
import vetAppointmentRouter from './routes/vetRoute/appointment.route.js';

// ADMIN ROUTER
import employeeRouter from './routes/adminRoute/admin-employee.route.js';
import serviceRouter from './routes/adminRoute/admin-service.route.js';
import appointmentRouter from './routes/adminRoute/admin-appointment.route.js';
import customerRouter from './routes/adminRoute/admin-customer.route.js';
import medicineRouter from './routes/adminRoute/admin-medicine.route.js';
import statisticRouter from './routes/adminRoute/admin-statistical.route.js';
import invoiceRouter from './routes/adminRoute/admin-invoice.route.js';

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/static', express.static(path.join(__dirname, 'static')));

app.use(express.urlencoded({
    extended: true,
}));

app.use(express.json());

app.engine('handlebars', engine({
    defaultLayout: 'share-layout',
    layoutsDir: path.join(__dirname, 'views/layouts'),

    helpers: {
        formatDate(date) {
            return new Date(date).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        },
        formatDateForInput(date) {
            if (!date) return '';
            const d = new Date(date);
            if (isNaN(d.getTime())) return '';
            
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            
            return `${year}-${month}-${day}`;
        },
        getInitial(name) {
            if (!name || !name.trim()) return 'U';
            return name.trim().charAt(0).toUpperCase();
        },
        eq(a, b) {
            return a === b;
        },
        or(a, b) {
            return a || b;
        },
        substring(str, start, end) {
            if (!str) return '';
            return str.substring(start, end);
        },
        json(context) {
            return JSON.stringify(context);
        },
        add(a, b) {
            return a + b;
        },
        subtract(a, b) {
            return a - b;
        },
        multiply(a, b) {
            return a * b;
        },
        divide(a, b) {
            return a / b;
        },
        limit: function(arr, limit) {
            if (!Array.isArray(arr)) { return []; }
            return arr.slice(0, limit);
        },
        gt (a, b) {
            return a > b;
        },
        lt (a, b) {
            return a < b;
        },
        section: expressHandlebarsSections()
    }
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
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
    res.locals.schedule = req.session.schedule ? req.session.schedule : null;
    res.locals.medicines = req.session.medicines ? req.session.medicines : null;
    next();
});

// Public Routers
app.use('/', accountRouter);
app.use('/profile', isAuth, profileRouter);

// Customer Routers
app.use('/pets', isAuth, isCustomer, petCustomerRouter);
app.use('/appointments', isAuth, isCustomer, appointmentCustomerRouter);

// Veterinarian Routers
app.use('/vet/schedule', isAuth, isVeterinarian, vetScheduleRouter);
app.use('/vet/appointment', isAuth, isVeterinarian, vetAppointmentRouter);

// Admin Routers  
app.use('/admin/customers', isAuth, isAdmin, customerRouter);
app.use('/admin/employees', isAuth, isAdmin, employeeRouter);
app.use('/admin/medicines', isAuth, isAdmin, medicineRouter);
app.use('/admin/appointments', isAuth, isAdmin, appointmentRouter);
app.use('/admin/services', isAuth, isAdmin, serviceRouter);
app.use('/admin/invoices', isAuth, isAdmin, invoiceRouter);
app.use('/admin/statistics', isAuth, isAdmin, statisticRouter);

app.use((req, res) => {
    res.status(403).render('403');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});