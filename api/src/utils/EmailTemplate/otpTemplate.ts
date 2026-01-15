export default (otp: string) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OTP Verification</title>
    <style>
      body {
        font-family: "Arial", sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 480px;
        margin: 30px auto;
        background: #ffffff;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
      }
      .header {
        font-size: 22px;
        font-weight: bold;
        color: #333;
      }
      .sub-header {
        font-size: 16px;
        color: #555;
        margin: 10px 0;
      }
      .otp {
        font-size: 32px;
        font-weight: bold;
        color: #007bff;
        background: #f1f7ff;
        display: inline-block;
        padding: 10px 20px;
        border-radius: 8px;
        margin: 20px 0;
        letter-spacing: 3px;
      }
      .message {
        font-size: 15px;
        color: #555;
        margin: 10px 0;
      }
      .footer {
        margin-top: 30px;
        font-size: 13px;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Your One-Time Password (OTP)</div>
      <p class="sub-header">Use the OTP below to proceed with verification.</p>
      <div class="otp">${otp}</div>
      <p class="message">
        This OTP is valid for <strong>10 minutes</strong>. Do not share it with
        anyone for security reasons.
      </p>
      <p class="footer">
        If you did not request this, simply ignore this email.
      </p>
    </div>
  </body>
</html>
`;
};
