import { subDays } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const checkins = await Checkin.findAll({
      where: { student_id: id },
      attributes: ['student_id', 'created_at'],
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id, { attributes: ['created_at'] });

    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const verifyCheckins = await Checkin.findAll({
      where: {
        student_id: id,
        created_at: {
          [Op.between]: [subDays(new Date(), 7), new Date()],
        },
      },
    });

    if (verifyCheckins) {
      if (verifyCheckins.length >= 5) {
        return res
          .status(400)
          .json({ error: 'You can only do 5 check-ins every 7 days' });
      }
    }

    await Checkin.create({
      student_id: id,
    });

    return res.json({
      checkIn: {
        student,
      },
    });
  }
}

export default new CheckinController();
