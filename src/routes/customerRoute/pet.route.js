import express from 'express';
import * as petService from '../../models/pet.model.js';

const router = express.Router();

router.get('/', async function (req, res) {
    const pets = await petService.getPetByOwnerID(req.session.authUser.user_id);
    const success = req.query.success;

    res.render('vwCustomer/pet-list', {
        pets: pets,
        activeTab: 'pets',
        success: success,
        isAddMode: false
    });
});

router.get('/add', async function (req, res) {
    const pets = await petService.getPetByOwnerID(req.session.authUser.user_id);
    res.render('vwCustomer/pet-list', {
        pets: pets,
        activeTab: 'pets',
        isAddMode: true
    });
});

router.post('/add', async function (req, res) {
    const pet = {
        owner_id: req.session.authUser.user_id,
        name: req.body.name,
        species: req.body.species,
        sex: req.body.sex || null,
        day_born: req.body.day_born || null,
        weight: req.body.weight || null,
        notes: req.body.notes || null
    };

    await petService.addPet(pet);

    const pets = await petService.getPetByOwnerID(req.session.authUser.user_id);
    req.session.pets = pets;

    res.redirect('/pets?success=added');
});

router.get('/edit', async function (req, res) {
    const petId = req.query.id;
    const pet = await petService.getPetByID(petId);

    if (!pet || pet.owner_id !== req.session.authUser.user_id) {
        return res.status(404).render('404');
    }

    const pets = await petService.getPetByOwnerID(req.session.authUser.user_id);
    res.render('vwCustomer/pet-list', {
        pets: pets,
        editPet: pet,
        activeTab: 'pets',
        isEditMode: true
    });
});

router.post('/edit', async function (req, res) {
    const petId = req.query.id;
    const pet = await petService.getPetByID(petId);

    if (!pet || pet.owner_id !== req.session.authUser.user_id) {
        return res.status(404).render('404');
    }

    const updatedPet = {
        name: req.body.name,
        species: req.body.species,
        sex: req.body.sex || null,
        day_born: req.body.day_born || null,
        weight: req.body.weight || null,
        notes: req.body.notes || null
    };

    await petService.updatePetInfo(petId, updatedPet);

    const pets = await petService.getPetByOwnerID(req.session.authUser.user_id);
    req.session.pets = pets;

    res.redirect('/pets?success=updated');
});

export default router;