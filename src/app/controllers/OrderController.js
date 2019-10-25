import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import Mail from '../../lib/Mail';

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

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Resposta a sua pergunta',
      template: 'answer',
      context: {
        student: student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
      },
    });

    return res.json(helpOrder);
  }
}

export default new OrderController();
