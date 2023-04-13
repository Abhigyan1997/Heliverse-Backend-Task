const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const openai = require('openai');
const mongoose = require('mongoose');

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const emailSchema = new mongoose.Schema({
  subject: String,
  body: String,
  category: String
});

const Email = mongoose.model('Email', emailSchema);

const getEmails = async () => {
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  const response = await gmail.users.messages.list({
    userId: 'me',
    q: 'is:unread',
    maxResults: 10
  });

  const emails = [];

  for (const message of response.data.messages) {
    const email = await getEmail(message.id);
    emails.push(email);
  }

  return emails;
};

const getEmail = async (id) => {
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  const message = await gmail.users.messages.get({
    userId: 'me',
    id
  });

  const headers = message.data.payload.headers;
  const subject = headers.find(header => header.name === 'Subject').value;
  const body = message.data.snippet;

  const category = await classifyContent(body);

  return new Email({
    subject,
    body,
    category
  });
};

const classifyContent = async (content) => {
  const prompt = `Classify this content into 3 categories: Bugs, Sales and Updates\n${content}`;
  const response = await openai.complete({
    engine: 'text-davinci-002',
    prompt,
    maxTokens: 1,
    n: 1,
    stop: '\n'
  });

  return response.data.choices[0].text.trim();
};

module.exports = {
  getEmails
};
