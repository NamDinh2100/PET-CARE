import express from 'express';
import { engine } from 'express-handlebars';
import expressHandlebarsSections from 'express-handlebars-sections';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

// USER ROUTER
import profileRouter from './routes/customer-profile.route.js'


// ADMIN ROUTER
import accountRouter from './routes/account.route.js';
import employeeRouter from './routes/admin-employee.route.js';
import serviceRouter from './routes/admin-service.route.js';
import appointmentRouter from './routes/admin-appointment.route.js';
import userRouter from './routes/admin-customer.route.js';
import medicineRouter from './routes/admin-medicine.route.js';
import statisticRouter from './routes/admin-statistical.route.js';

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
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    
    // 🎯 QUAN TRỌNG: Gộp tất cả đường dẫn partials vào 1 mảng duy nhất
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
        section(name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
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
  next();
});



app.use('/', accountRouter);

//app.use('/veterinarian/appointments', veterinarianAppointmentRouter);


app.use('/profile', profileRouter);

// Admin Routers
app.use('/admin/customers', userRouter);
app.use('/admin/medicines', medicineRouter);
app.use('/admin/employees', employeeRouter);
app.use('/admin/appointments', appointmentRouter);
app.use('/admin/services', serviceRouter);
app.use('/admin/statistical', statisticRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/signin`);
});