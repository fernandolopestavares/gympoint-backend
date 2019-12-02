import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import AnswerMail from '../jobs/AnswerMail';
import Queue from '../../lib/Queue';

class OrderController {
  async show(req, res) {
    const { id } = req.params;

    const student = await Student.findOne({
      where: { id },
    });

    if (!student) {
      return res.json({ error: 'Student does not exist' });
    }

    const orderById = await HelpOrder.findAll({
      where: { student_id: student.id },
      attributes: [
        'id',
        'student_id',
        'answer',
        'question',
        'answer_at',
        'created_at',
      ],
    });

    if (orderById.length === 0) {
      return res.json({
        error: 'Does not exists help orders with this Student id',
      });
    }

    return res.json(orderById);
  }

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
