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
      html: subject === 'verification OTP Code' ? verifyEmailTemplate(text) : resetEmailTemplate(text)
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
              <h3 class="text-2xl">Thanks for signing up from Mr. Khizar Abbas!</h3>
              <div class="flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 text-green-400" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                          d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                  </svg>
              </div>

              <p>We're happy you're here. Let's get your email address verified:</p>
              <div class="mt-4 flex gap-4">
              <h3>Your OTP Code for email verification is</h3>
                <h1>${text}</h1>
              </div>
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
              <h3 class="text-2xl">Forgot your password? don't worry reset it with OTP Code</h3>
              <div class="flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 text-green-400" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                          d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                  </svg>
              </div>

              <p>We're happy you're here. Let's Reset your Password:</p>
              <div class="mt-4 flex gap-4">
              <h3>Your OTP Code to Reset your Password is</h3>
                <h1>${text}</h1>
              </div>
          </div>
      </div>
  </body>
</html>`;
};
