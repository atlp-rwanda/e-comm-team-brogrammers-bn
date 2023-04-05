import { Subscriber } from '../database/models';
import { setApiKey, send } from '@sendgrid/mail';
setApiKey(process.env.SENDGRID_API_KEY);

dotenv.config();

async function subscribe(req, res) {
  const { firstName, lastName, email } = req.body;
  try {
    const subscriber =  await Subscriber.create({ firstName, lastName, email });
    const msg = {
      to: email,
      from: process.env.EMAIL_SENDER,
      subject: 'Confirm your subscription to our newsletter',
      text: `Hello ${firstName} ${lastName}! Please confirm your subscription to our newsletter by clicking on this link: http://${req.headers.host}/confirm-email?id=${subscriber.id}`
    };
    await send(msg);
    res.status(200).send('Check your email to confirm your subscription!');
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while subscribing. Please try again later.');
  }
}

async function confirmEmail(req, res) {
  const { id } = req.query;
  try {n
    const subscriber = await Subscriber.findByPk(id);
    if (!subscriber) {
      return res.status(404).send('Subscriber not found.');
    }
    await subscriber.update({ isConfirmed: true });
    res.status(200).send('You are now subscribed to the newsletter!');
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while confirming your email. Please try again later.');
  }
}

async function sendNewsletter(req, res) {
  const { subject, message, file } = req.body;
  try {
    const subscribers = await Subscriber.findAll({ where: { isConfirmed: true } });
    const unsubscribeUrl = `http://${req.headers.host}/unsubscribe`;
    const msg = {
      to: subscribers.map(subscriber => subscriber.email),
      from: process.env.EMAIL_SENDER,
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
    await send(msg);
    res.status(200).send('Newsletter sent successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while sending the newsletter. Please try again later.');
  }
}

async function unsubscribe(req, res) {
  const { email } = req.query;
  try {
    const subscriber = await Subscriber.findOne({ where: { email } });
    if (!subscriber) {
      return res.status(404).send('Subscriber not found.');
    }
    await subscriber.update({ isConfirmed: false });
    res.status(200).send('You have been unsubscribed from the newsletter.');
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while unsubscribing. Please try again later.');
  }
}

export default {
  subscribe,
  confirmEmail,
  sendNewsletter,
  unsubscribe
};
