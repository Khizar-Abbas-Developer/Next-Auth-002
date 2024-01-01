import nodemailer from 'nodemailer';

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // Set to false to use STARTTLS
      auth: { 
        user: process.env.USER,
        pass: process.env.PASS
      }
    });

    await transporter.sendMail({
      from: 'Next-JS',
      to: email,
      subject: subject,
      text: text,
      html: subject === 'Email Verification' ? verifyEmailTemplate(text) : resetEmailTemplate(text)
    });
  } catch (error) {
    console.log('email not sent!');
    console.log(error);
    return error;
  }
};
export default sendEmail;

const verifyEmailTemplate = (text) => {
  return `<html>
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tailwind CSS Simple Email Template Example </title>
      <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
  </head>
  <body>
      <div class="flex items-center justify-center min-h-screen p-5 bg-blue-100 min-w-screen">
          <div class="max-w-xl p-8 text-center text-gray-800 bg-white shadow-xl lg:max-w-3xl rounded-3xl lg:p-12">
              <h3 class="text-2xl">Email Verification Request</h3>
              <div class="flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 text-green-400" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                          d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                  </svg>
              </div> 

              <p>We received an Email Verification request for your account. If you did not make this request, please ignore this email.</p>
              <div class="mt-4">
                <a href="${text}" class="px-4 py-2 bg-blue-600 text-white rounded-full">Click to Verify your Email</a>
              </div>
              <p>If you're having trouble clicking the "Verification" button, copy and paste the following URL into your web browser:</p>
              <p class="text-blue-600 underline">${text}</p>
          </div>
      </div>
  </body>
</html>`;
};


const resetEmailTemplate = (text) => {
  return `<html>
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tailwind CSS Simple Email Template Example </title>
      <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
  </head>
  <body>
      <div class="flex items-center justify-center min-h-screen p-5 bg-blue-100 min-w-screen">
          <div class="max-w-xl p-8 text-center text-gray-800 bg-white shadow-xl lg:max-w-3xl rounded-3xl lg:p-12">
              <h3 class="text-2xl">Password Reset Request</h3>
              <div class="flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 text-green-400" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                          d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                  </svg>
              </div>

              <p>We received a request to reset the password for your account. If you did not make this request, please ignore this email.</p>
              <div class="mt-4">
                <a href="${text}" class="px-4 py-2 bg-blue-600 text-white rounded-full">Reset Password</a>
              </div>
              <p>If you're having trouble clicking the "Reset Password" button, copy and paste the following URL into your web browser:</p>
              <p class="text-blue-600 underline">${text}</p>
          </div>
      </div>
  </body>
</html>`;
};
