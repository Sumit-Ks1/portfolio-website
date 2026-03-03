# Email Setup with Resend

This portfolio website uses [Resend](https://resend.com) for handling contact form submissions.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Resend account and API key

## Setup Instructions

### 1. Get Your Resend API Key

1. Sign up for a free account at [resend.com](https://resend.com)
2. Go to your dashboard and navigate to **API Keys**
3. Create a new API key and copy it

### 2. Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Resend API key:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
   FROM_EMAIL=onboarding@resend.dev
   PORT=3001
   NODE_ENV=development
   ```

   **Note:** 
   - With a free Resend account, you can only send from `onboarding@resend.dev`
   - To use a custom domain (e.g., `contact@yourdomain.com`), you need to verify your domain in Resend dashboard

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

### 5. Open Your Portfolio

Open `index.html` in your browser or use a local development server:

```bash
# Using Python
python -m http.server 8000

# Or using Node.js http-server
npx http-server -p 8000
```

Then visit `http://localhost:8000`

## Testing the Contact Form

1. Make sure the backend server is running (`npm start`)
2. Open your portfolio in a browser
3. Navigate to the Contact section
4. Fill out the form and submit
5. You should receive an email at `sumit127624@gmail.com`

## Deployment

### Option 1: Deploy Both Frontend and Backend Together

Deploy to platforms like:
- **Railway**: Supports Node.js apps
- **Render**: Free tier for web services
- **Heroku**: Full stack deployment

### Option 2: Serverless Functions

Convert `server.js` to serverless functions for:
- **Vercel**: Create `api/send-email.js` in the api folder
- **Netlify**: Use Netlify Functions
- **AWS Lambda**: Use API Gateway + Lambda

### Example Vercel Serverless Function

Create `api/send-email.js`:
```javascript
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['sumit127624@gmail.com'],
      subject: `Portfolio Contact from ${name}`,
      reply_to: email,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
```

Then update the fetch URL in `script.js` to `/api/send-email`.

## Troubleshooting

### Email not sending?
- Check if the backend server is running
- Verify your Resend API key is correct
- Check browser console for errors
- Ensure CORS is enabled (already configured in server.js)

### CORS errors?
- Make sure the backend server is running
- Check that the fetch URL in `script.js` matches your server URL
- For production, update CORS settings in `server.js`

### Want to use a custom domain?
1. Add and verify your domain in Resend dashboard
2. Update `FROM_EMAIL` in `.env` to use your domain (e.g., `contact@yourdomain.com`)

## Security Notes

- Never commit your `.env` file (it's already in `.gitignore`)
- Keep your Resend API key secret
- For production, add rate limiting to prevent abuse
- Consider adding reCAPTCHA for additional security

## Support

For issues with Resend, visit: https://resend.com/docs
