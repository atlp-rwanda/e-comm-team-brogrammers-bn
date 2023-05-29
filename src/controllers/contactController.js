// controllers/contactController.js
// eslint-disable-next-line import/named
import { contacts } from '../database/models';

const createContact = async (req, res) => {
  try {
    const { username, email, message } = req.body;
    const newContact = await contacts.create({
      username,
      email,
      message,
    });
    res.status(201).json({ success: true, contacts: newContact });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to create contact' });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const allContacts = await contacts.findAll();
    res.status(200).json({ success: true, contacts: allContacts });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to retrieve contacts' });
  }
};

export default {
  createContact,
  getAllContacts,
};
