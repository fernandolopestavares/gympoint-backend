import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    return res.json({ ok: true });
  }
}

export default new PlanController();
