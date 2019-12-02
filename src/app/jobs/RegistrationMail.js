import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { student, plan, planPrice, finalMonth } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Realização de Matrícula',
      template: 'registration',
      context: {
        student: student.name,
        plan_name: plan.title,
        price: planPrice,
        date: format(parseISO(finalMonth), "'dia' dd 'de' MMMM', às' H:mm'h'", {
          locale: pt,
        }),
      },
    });
  }
}

export default new RegistrationMail();
