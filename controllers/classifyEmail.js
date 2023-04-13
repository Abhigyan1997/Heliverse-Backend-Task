const { getEmails } = require('../models/classifyEmail');

const getEmailsController = async (req, res) => {
  const emails = await getEmails();
  res.render('email', { emails });
};

module.exports = {
  getEmailsController
};
