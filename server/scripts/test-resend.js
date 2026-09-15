const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { sendContactNotification } = require('../services/emailService');

console.log('Testing Resend email service with:');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.substring(0, 8)}...` : 'NOT FOUND');
console.log('ADMIN_EMAIL / EMAIL_USER:', process.env.ADMIN_EMAIL || process.env.EMAIL_USER);

async function runTest() {
  console.log('\nSending test message notification...');
  const result = await sendContactNotification({
    name: 'Test Client (Portfolio Verification)',
    email: 'test.client@example.com',
    projectType: 'Commercial Video Edit',
    message: 'Hello Manish, this is an automated test message to verify your Resend email integration is working properly!',
  });

  console.log('\nResult:', JSON.stringify(result, null, 2));

  if (result.success) {
    console.log('\n SUCCESS! Check your Gmail inbox at:', process.env.ADMIN_EMAIL || process.env.EMAIL_USER);
  } else {
    console.error('\n FAILED to send email. Check the error above.');
  }
}

runTest();
