export const resetPasswordTemplate = (otp: string): string => {
  return `
    <!DOCTYPE html>
<html lang="en" style="margin:0;padding:0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset Code</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.05);overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:#dc2626;padding:20px;text-align:center;color:#ffffff;">
              <h1 style="margin:0;font-size:22px;font-weight:600;">Password Reset Request</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px;text-align:left;color:#374151;">
              <p style="font-size:16px;margin-bottom:16px;">Hello,</p>
              <p style="font-size:15px;line-height:1.5;margin-bottom:24px;">
                We received a request to reset your password for your <strong>Test_School</strong> account.  
                Please use the OTP code below to proceed.  
                This code will expire in <strong>5 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <div style="text-align:center;margin-bottom:24px;">
                <span style="display:inline-block;font-size:28px;letter-spacing:8px;background:#f3f4f6;color:#1f2937;padding:14px 20px;border-radius:8px;font-weight:bold;">
                  ${otp}
                </span>
              </div>

              <p style="font-size:14px;color:#6b7280;margin-bottom:16px;">
                If you did not request a password reset, please ignore this email.  
                Your account remains secure unless this code is used.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f3f4f6;padding:16px;text-align:center;font-size:12px;color:#9ca3af;">
              © 2025 Test_School. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>

    `;
};
