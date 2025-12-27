import express from 'express';

const router = express.Router();

router.get('/schedule', async function (req, res) {
    res.render('vwVeterinarian/schedule',
        { layout: 'vet-layout' }
    )
});

export default router;