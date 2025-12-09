import express from 'express';

const router = express.Router();

router.get('/recept', function (req, res) {
    res.render('vwVeterinarian/vwAppointment/recept');
});

export default router;