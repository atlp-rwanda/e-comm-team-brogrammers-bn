// eslint-disable-next-line import/named
import { Subscriber} from '../database/models';
import { sendEmail } from '../helpers/mail';

   /**
   * @param {Object} req
   * @param {Object} res
   * @returns {res} response
   */
export const subscribe = async (req, res) => {
    const { firstName, lastName, email } = req.body;
    try {
      const existingSubscriber = await Subscriber.findOne({ where: { email } });
      if (existingSubscriber && existingSubscriber.isConfirmed) {
        return res.status(409).json({ message: 'You are already subscribed!' });
      }
      if (existingSubscriber && !existingSubscriber.isConfirmed) {
        const msg = {
          to: email,
          from: 'brogrammer@gmail.com',
          subject: 'Confirm your subscription to our newsletter',
          text: `Hello ${firstName} ${lastName}! Please confirm your subscription to our newsletter by clicking on this link: http://${req.headers.host}/confirm-email?id=${existingSubscriber.id}`
        };
        await sendEmail(msg);
        return res.status(200).json({ message: 'Check your email to confirm your subscription!' });
      }
      const subscriber = await Subscriber.create({ firstName, lastName, email });
      const msg = {
        to: email,
        from: 'brogrammer@gmail.com',
        subject: 'Confirm your subscription to our newsletter',
        text: `Hello ${firstName} ${lastName}! Please confirm your subscription to our newsletter by clicking on this link: http://${req.headers.host}/confirm-email?id=${subscriber.id}`
      };
      await sendEmail(msg);
      res.status(200).json({ message: 'Check your email to confirm your subscription!' });
    } catch (err) {
      res.status(500).json({ message: 'An error occurred while subscribing. Please try again later.' });
    }
  }

   /**
   * @param {*} req
   * @param {*} res
   * @returns {res} response
   */
export const confirmEmail = async (req, res) => {
  const { id } = req.query;
  try {
    const subscriber = await Subscriber.findByPk(id);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    await subscriber.update({ isConfirmed: true });
    res.status(200).json({message: 'You are now subscribed to the newsletter!'});
  } catch (err) {
    res.status(500).json({message: 'An error occurred while confirming your email. Please try again later.'});
  }
}
  /**
   * @param {*} req
   * @param {*} res
   * @returns {res} response
   */
export const sendNewsletter = async (req, res) => {
  const { subject, message, file } = req.body;
  try {
    const subscribers = await Subscriber.findAll({ where: { isConfirmed: true } });
    const unsubscribeUrl = `http://${req.headers.host}/unsubscribe`;
    const msg = {
      to: subscribers.map(subscriber => subscriber.email),
      from: 'brogrammer@gmail.com',
      subject,
      text: message,
      attachments: [
        {
          content: file.data.toString('base64'),
          filename: file.name,
          type: file.type,
          disposition: 'attachment',
        },
      ],
      html: `<p>${message}</p><a href="${unsubscribeUrl}?email={{email}}">Unsubscribe</a>`,
    };
    await sendEmail(msg);
    res.status(200).json({message:'Newsletter sent successfully!'});
  } catch (err) {
    res.status(500).json({message:'An error occurred while sending the newsletter. Please try again later.'});
  }
}

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {res} response
   */
export const unsubscribe = async (req, res) => {
  const { email } = req.query;
  try {
    const subscriber = await Subscriber.findOne({ where: { email } });
    if (!subscriber) {
      return res.status(404).json({message:'Subscriber not found.'});
    }
    await subscriber.update({ isConfirmed: false });
    res.status(200).json({message:'You have been unsubscribed from the newsletter.'});
  } catch (err) {
    res.status(500).json({message:'An error occurred while unsubscribing. Please try again later.'});
  }
}

export default {
  subscribe,
  confirmEmail,
  sendNewsletter,
  unsubscribe
};
