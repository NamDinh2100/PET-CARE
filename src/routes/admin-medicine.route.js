import express from 'express';

const router = express.Router();

router.get('/', async function (req, res) {
    res.render('vwAdmin/vwMedicine/list', { 
        isAddMode: false,
        layout: 'admin-layout'
    });
});

router.get('/add', function (req, res) {
    res.render('vwAdmin/vwMedicine/list', { 
        isAddMode: true,
        layout: 'admin-layout'
    });
});

router.post('/add', async function (req, res) {
    const medicine = {
        medicine_name: req.body.medicine_name,
        form: req.body.form,
        category: req.body.category,
        description: req.body.description,
    };

    await medicineService.addMedicine(medicine);
    res.redirect('/admin/medicine');
});

router.get('/edit', async function (req, res) {
    const id = req.query.id;
    const medicine = await medicineService.getMedicineByID(id);
    res.render('vwAdmin/vwMedicine/edit', { medicine });
});

router.post('/edit', async function (req, res) {
    const id = req.query.id;
    const medicine = {
        medicine_name: req.body.medicine_name,
        form: req.body.form,
        category: req.body.category,
        description: req.body.description,
    };
    await medicineService.updateMedicine(id, medicine);
    res.redirect('/admin/medicine');
});

router.get('/delete', async function (req, res) {
    const id = req.query.id;
    await medicineService.deleteMedicine(id);
    res.redirect('/admin/medicine');
});

export default router;