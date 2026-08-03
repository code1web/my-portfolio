import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dataFilePath = path.join(__dirname, 'src', 'data', 'portfolio.json');

// --- Admin Static Credentials ---
const ADMIN_EMAIL = 'admin@admin.com';
const ADMIN_PASSWORD = 'password123';
const STATIC_TOKEN = 'secret-admin-token-12345';

// --- Auth Middleware ---
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${STATIC_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized. Invalid or missing token.' });
  }
  next();
};

// --- Login Endpoint ---
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.status(200).json({ token: STATIC_TOKEN, message: 'Login successful' });
  }
  
  return res.status(401).json({ error: 'Invalid email or password' });
});

// --- Save Data Endpoint (Protected) ---
app.post('/api/save', requireAuth, (req, res) => {
  try {
    const data = req.body;
    // Write data beautifully formatted
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.SENDINBLUE_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'code master', email: 'vikash.thaver@gmail.com' },
        replyTo: { name: name, email: email },
        to: [{ email: 'vikash.thaver@gmail.com', name: 'Vikash Choudhary' }],
        subject: `New Portfolio Message from ${name}`,
        htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; background-color: #f6f9fc;">
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); background-color: #ffffff;">
    <div style="background-color: #2c3e50; padding: 20px; text-align: center;">
      <h2 style="color: #ffffff; margin: 0; font-size: 24px;">New Portfolio Message</h2>
    </div>
    <div style="padding: 30px; color: #333333;">
      <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
        You have received a new message from your portfolio website's contact form.
      </p>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; width: 100px; font-weight: bold; color: #555555;">Name:</td>
          <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; color: #111111;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #555555;">Email:</td>
          <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">
            <a href="mailto:${email}" style="color: #3498db; text-decoration: none;">${email}</a>
          </td>
        </tr>
      </table>
      <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #3498db; border-radius: 4px; color: #444444; line-height: 1.6; white-space: pre-wrap;">${message}</div>
    </div>
    <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #e0e0e0;">
      This email was automatically generated from your portfolio contact form.
    </div>
  </div>
</body>
</html>`
      })
    });

    if (response.ok) {
      res.status(200).json({ success: true, message: 'Email sent successfully' });
    } else {
      const errorData = await response.json();
      console.error('Brevo API Error:', errorData);
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Server error while sending email' });
  }
});

app.listen(PORT, () => {
  console.log(`Local Admin API server running at http://localhost:${PORT}`);
});
