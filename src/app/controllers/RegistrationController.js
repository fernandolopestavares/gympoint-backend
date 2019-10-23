import Student from '../models/Student';
import Registration from '../models/Registration';

class RegistrationController {
  async store(req, res) {
    const student = await Student.findByPk(req.params.student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const { student_id } = req.params;
    const { start_date, end_date, plan_id, price } = req.body;

    await Registration.create({
      student_id,
      start_date,
      end_date,
      plan_id,
      price,
    });

    return res.json({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });
  }
}

export default new RegistrationController();
