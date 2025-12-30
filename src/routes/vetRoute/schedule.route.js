import express from 'express';

const router = express.Router();

router.get('/', async function (req, res) {
    res.render('vwVeterinarian/schedule',
        { layout: 'vet-layout' }
    )
});

export default router;