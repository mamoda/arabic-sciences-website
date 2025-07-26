import express from 'express';
import ScientistsController from '../controllers/scientistsController';

const router = express.Router();
const scientistsController = new ScientistsController();

// Route to create a new scientist
router.post('/', scientistsController.createScientist);

// Route to get all scientists
router.get('/', scientistsController.getScientists);

// Route to get a scientist by ID
router.get('/:id', scientistsController.getScientistById);

// Route to update a scientist by ID
router.put('/:id', scientistsController.updateScientist);

// Route to delete a scientist by ID
router.delete('/:id', scientistsController.deleteScientist);

export default router;