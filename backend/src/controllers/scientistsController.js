import Scientist from '../models/scientist';

class ScientistsController {
  async createScientist(req, res) {
    try {
      const scientist = new Scientist(req.body);
      await scientist.save();
      res.status(201).json(scientist);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getScientists(req, res) {
    try {
      const scientists = await Scientist.find();
      res.status(200).json(scientists);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getScientistById(req, res) {
    try {
      const scientist = await Scientist.findById(req.params.id);
      if (!scientist) {
        return res.status(404).json({ message: 'Scientist not found' });
      }
      res.status(200).json(scientist);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateScientist(req, res) {
    try {
      const scientist = await Scientist.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!scientist) {
        return res.status(404).json({ message: 'Scientist not found' });
      }
      res.status(200).json(scientist);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteScientist(req, res) {
    try {
      const scientist = await Scientist.findByIdAndDelete(req.params.id);
      if (!scientist) {
        return res.status(404).json({ message: 'Scientist not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new ScientistsController();