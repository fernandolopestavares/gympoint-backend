import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'price', 'duration'],
      order: ['id'],
    });

    if (!plans) {
      return res.status(400).json({ error: 'Plans not found' });
    }

    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { title } = req.body;

    const plan = await Plan.findOne({
      where: { title },
    });

    if (plan) {
      return res
        .status(400)
        .json({ error: 'Already exists a plan with this name' });
    }

    const { id, duration, price } = await Plan.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { plan_id } = req.params;
    const { title } = req.body;

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist ' });
    }

    if (!(title !== plan.title)) {
      return res.status(401).json({ error: 'Title already in use' });
    }

    const { price, duration } = await plan.update(req.body);

    return res.json({
      plan_id,
      title,
      price,
      duration,
    });
  }

  async delete(req, res) {
    const { plan_id } = req.params;

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan ID not found' });
    }

    await plan.destroy();

    return res.send();
  }
}

export default new PlanController();
