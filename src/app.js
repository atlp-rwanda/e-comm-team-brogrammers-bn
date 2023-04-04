/* eslint-disable radix */
/* eslint-disable object-shorthand */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-else-return */
/* eslint-disable no-throw-literal */
/* eslint-disable no-undef */
/* eslint-disable quote-props */
/* eslint-disable no-use-before-define */
/* eslint-disable require-jsdoc */
/* eslint-disable indent */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import env from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import passport from 'passport';
import cookieSession from 'cookie-session';
import path from 'path';
import allroutes from './routes/index';
import swagger from './configs/swagger';
import checkPasswordExpirationCronJob from './middlewares/passwordExpiration';
import route from './routes/auth';
import beforeCheckExpiredProduct from './middlewares/productExpAll';

const sgMail = require('@sendgrid/mail');
const sgClient = require('@sendgrid/client');
const expressFileUpload = require('express-fileupload');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
sgClient.setApiKey(process.env.SENDGRID_API_KEY);

env.config();

const app = express();
checkPasswordExpirationCronJob.start();
beforeCheckExpiredProduct();

app.use('/chat', express.static(path.join(__dirname, '../public/chat')));
app.use(express.urlencoded({
  extended: true
 }));
app.use(express.json());
app.use(cors());
app.use(
  cookieSession({
    name: 'google-auth-session',
    keys: ['key1', ['key2']],
  })
);
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressFileUpload());
app.set('view engine', 'ejs');
app.use('/auth', route);

app.use('/public', express.static('public'));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swagger));
// Routes

app.get('/signup', (req, res) => {
  res.render('form', signUpPage);
});
app.post('/signup', async (req, res) => {
  const confNum = randNum();
  const params = new URLSearchParams({
    conf_num: confNum,
    email: req.body.email,
  });
  const confirmationURL = `${req.protocol}://${req.headers.host}/confirm/?${params}`;
  const msg = {
    to: req.body.email,
    from: `nambajeeedwin@gmail.com`, // Change to your verified sender
    subject: `Confirm your subscription to our newsletter`,
    html: `Hello ${req.body.firstname},<br>Thank you for subscribing to our newsletter. Please complete and confirm your subscription by <a href="${confirmationURL}"> clicking here</a>.`
  };
    await addContact(req.body.firstname, req.body.lastname, req.body.email, confNum);
    console.log(addContact);
    await sgMail.send(msg);
    res.render('message', { message: 'Thank you for signing up for our newsletter! Please complete the process by confirming the subscription in your email inbox.' });
 });
 app.get('/confirm', async (req, res) => {
  try {
    const contact = await getContactByEmail(req.query.email);
    console.log(contact);
    console.log(req.query.conf_num);
    console.log(contact.custom_fields.conf_num);
    if (contact == null) throw `Contact not found.`;
    if (contact.custom_fields.conf_num === parseInt(req.query.conf_num)) {
      const listID = await getListID('Newsletter Subscribers');
      await addContactToList(req.query.email, listID);
    } else {
      throw 'Confirmation number does not match';
    }
    res.render('message', { message: 'You are now subscribed to our newsletter. We can\'t wait for you to hear from us!' });
  } catch (error) {
    console.error(error);
    res.render('message', { message: 'Subscription was unsuccessful. Please <a href="/signup">try again.</a>' });
  }
 });
 app.get('/upload', (req, res) => {
  res.render('form', uploadPage);
 });
 app.post('/upload', async (req, res) => {
    const listID = await getListID('Newsletter Subscribers');
    const htmlNewsletter = req.files.newsletter.data.toString();
    await sendNewsletterToList(req, htmlNewsletter, listID);
    res.render('message', { message: 'Newsletter has been sent to all subscribers.' });
 });
 app.get('/delete', async (req, res) => {
  try {
    const contact = await getContactByEmail(req.query.email);
    if (contact == null) throw `Contact not found.`;
    if (contact.custom_fields.conf_num === req.query.conf_num) {
      const listID = await getListID('Newsletter Subscribers');
      await deleteContactFromList(listID, contact);
      res.render('message', { message: 'You have been successfully unsubscribed. If this was a mistake re-subscribe <a href="/signup">here</a>.' });
  } else throw 'Confirmation number does not match or contact is not subscribed';
  } catch (error) {
    console.error(error);
    res.render('message', { message: 'Email could not be unsubscribed. please try again.' });
  }
 });
// Helper functions and variables
const signUpPage = {
  title: 'Join Our Newsletter',
  subtitle: 'Subscribe to our newsletter to receive the latest news and products.',
  form: `<form action="/signup" id="contact-form" method="post" style="margin: 10%; margin-left:5%; width: 350px;">
      <div class="form-group">
          <label for="firstname">First Name</label>
          <input type="text" class="form-control" id="firstname" name="firstname" placeholder="First Name" required>
      </div>
      <div class="form-group">
          <label for="lastname">Last Name</label>
          <input class="form-control" id="lastname" name="lastname" placeholder="Last Name" required>
      </div>
      <div class="form-group">
          <label for="email">Email address</label>
          <input type="email" class="form-control" id="email" name="email" placeholder="Enter email">
          <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
      </div>
      <button type="submit" style="background:#0263e0 !important;" class="btn btn-primary">Subscribe</button>
  </form>`
};
 function randNum() {
  return Math.floor(Math.random() * 90000) + 10000;
 }
 async function addContact(firstName, lastName, email, confNum) {
  const customFieldID = await getCustomFieldID('conf_num');
  const data = {
    "contacts": [{
      "email": email,
      "first_name": firstName,
      "last_name": lastName,
      "custom_fields": {}
    }]
  };
  data.contacts[0].custom_fields[customFieldID] = confNum;
  const request = {
    url: `/v3/marketing/contacts`,
    method: 'PUT',
    body: data
  };
  return sgClient.request(request);
 }
 async function getCustomFieldID(customFieldName) {
  const request = {
    url: `/v3/marketing/field_definitions`,
    method: 'GET',
  };
  const response = await sgClient.request(request);
  const allCustomFields = response[1].custom_fields;
  return allCustomFields.find((x) => x.name === customFieldName).id;
 }
 async function getContactByEmail(email) {
  const data = {
    "emails": [email]
  };
  const request = {
    url: `/v3/marketing/contacts/search/emails`,
    method: 'POST',
    body: data
  };
  const response = await sgClient.request(request);
  if (response[1].result[email]) return response[1].result[email].contact;
  else return null;
 }
 async function getListID(listName) {
  const request = {
    url: `/v3/marketing/lists`,
    method: 'GET',
  };
  const response = await sgClient.request(request);
  const allLists = response[1].result;
  return allLists.find((x) => x.name === listName).id;
 }
 async function addContactToList(email, listID) {
  const data = {
    "list_ids": [listID],
    "contacts": [{
      "email": email
    }]
  };
  const request = {
    url: `/v3/marketing/contacts`,
    method: 'PUT',
    body: data
  };
  return sgClient.request(request);
 }
 const uploadPage = {
  title: 'Upload Newsletter',
  subtitle: 'Upload an HTML newsletter to send out to subscribers',
  form: `<form action="/upload" id="contact-form" enctype="multipart/form-data" method="post" style="margin: 10%; margin-left:5%; width: 350px;">
  <div class="form-group">
      <label for="subject">Email Subject:</label>
      <input type="text" class="form-control" id="subject" name="subject" placeholder="Subject" required>
  </div>
  <div class="form-group">
      <label for="newsletter">Newsletter: </label>
      <input type="file" id="newsletter" name="newsletter" accept=".html" required>
  </div>
  <button type="submit" style="background:#0263e0 !important;" class="btn btn-primary">Send</button>
 </form>`
 };
 async function sendNewsletterToList(req, htmlNewsletter, listID) {
  const data = {
    "query": `CONTAINS(list_ids, '${listID}')`
  };
  const request = {
    url: `/v3/marketing/contacts/search`,
    method: 'POST',
    body: data
  };
  const response = await sgClient.request(request);
  for (const subscriber of response[1].result) {
    const params = new URLSearchParams({
      conf_num: subscriber.custom_fields.conf_num,
      email: subscriber.email,
    });
    const unsubscribeURL = `${req.protocol}://${req.headers.host}/delete/?${params}`;
    const msg = {
      to: subscriber.email, // Change to your recipient
      from: `nambajeeedwin@gmail.com`, // Change to your verified sender
      subject: req.body.subject,
      html: `${htmlNewsletter}<a href="${unsubscribeURL}"> Unsubscribe here</a>`,
    };
    sgMail.send(msg);
  }
 }
 async function deleteContactFromList(listID, contact) {
  const request = {
    url: `/v3/marketing/lists/${listID}/contacts`,
    method: 'DELETE',
    qs: {
      "contact_ids": contact.id
    }
  };
  await sgClient.request(request);
 }
app.use(allroutes);
app.use((req, res) => {
  res.status(404).json({ message: 'Page not found' });
});

export default app;
