import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'A message is required' });
    }

    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const { question } = req.body;

    const createorder = await HelpOrder.create({
      student_id: id,
      question,
    });

    return res.json(createorder);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'A message is required' });
    }

    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const helpOrder = await HelpOrder.findOne({
      where: { student_id: id },
    });

    if (!helpOrder) {
      return res.status(400).json({ error: 'Help order does not exist' });
    }

    const { question } = req.body;

    if (!(question !== helpOrder.question)) {
      return res
        .status(400)
        .json({ error: ' This question has already been asked ' });
    }

    const updatedQuestion = await helpOrder.update({
      question,
    });

    return res.json(updatedQuestion);
  }
}

export default new HelpOrderController();
