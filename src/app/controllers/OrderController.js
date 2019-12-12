import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import AnswerMail from '../jobs/AnswerMail';
import Queue from '../../lib/Queue';

class OrderController {
  async show(req, res) {
    const { id } = req.params;

    const helpOrder = await HelpOrder.findByPk(id);

    if (!helpOrder) {
      return res.status(400).json({ error: 'Help order not found' });
    }

    return res.json(helpOrder);
  }

  async index(req, res) {
    const { page } = req.query;

    const ordersWithoutanswer = await HelpOrder.findAndCountAll({
      where: { answer: null },
      include: [
        {
          model: Student,
          as: 'student_order',
          attributes: ['name', 'email'],
        },
      ],
      attributes: ['id', 'student_id', 'question', 'created_at'],
      order: ['student_id'],
      limit: 10,
      offset: (page - 1) * 10,
    });

    if (ordersWithoutanswer.length === 0) {
      return res.json({ message: 'All help orders have been answered' });
    }

    return res.json(ordersWithoutanswer);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'An answer is required' });
    }
    const { id } = req.params;

    const helpOrder = await HelpOrder.findOne({
      where: { id },
    });

    if (!helpOrder) {
      return res.status(400).json({ error: 'Order does not exist' });
    }

    const student = await Student.findOne({
      where: { id: helpOrder.student_id },
    });

    const { answer } = req.body;

    const date = new Date();
    helpOrder.answer = answer;
    helpOrder.answer_at = date;
    await helpOrder.save();

    /**
     * Email
     */
    await Queue.add(AnswerMail.key, {
      helpOrder,
      student,
    });

    return res.json(helpOrder);
  }
}

export default new OrderController();
