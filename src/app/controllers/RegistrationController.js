import Student from '../models/Student';
import Registration from '../models/Registration';

class RegistrationController {
  async store(req, res) {
    const { student_id } = req.params;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const { start_date, end_date, plan_id } = await Registration.create(
      req.body
    );

    return res.json({
      student_id,
      plan_id,
      start_date,
      end_date,
    });
  }
}

export default new RegistrationController();
