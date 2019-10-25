import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

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
      attributes: ['student_id', 'question', 'created_at'],
    });

    return res.json(ordersWithoutanswer);
  }

  async store(req, res) {
    const { id } = req.params;

    const student = Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    return res.json({ ok: true });
  }
}

export default new OrderController();
