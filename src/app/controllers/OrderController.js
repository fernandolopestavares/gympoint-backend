import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import AnswerMail from '../jobs/AnswerMail';
import Queue from '../../lib/Queue';

class OrderController {
  async index(req, res) {
    const ordersWithoutanswer = await HelpOrder.findAll({
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
    });

    return res.json(ordersWithoutanswer);
  }

  async store(req, res) {
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
