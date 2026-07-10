export function generateEmailHTML(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Atif's Codeworks</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f1f5f9">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          
          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#38bdf8" style="padding: 40px 20px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Atif's Codeworks</h1>
              <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 500;">Where Ideas Become Interfaces.</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 32px;">
              <div style="font-size: 15px; line-height: 1.6; color: #374151;">
                ${content}
              </div>

              <!-- Signature -->
              <div style="margin-top: 40px; font-size: 14px; color: #4b5563;">
                <p style="margin: 0 0 12px;">Best regards,</p>
                <p style="margin: 0; font-weight: 700; color: #111827; font-size: 16px;">Atif Arman</p>
                <p style="margin: 4px 0 0; font-weight: 600; color: #374151;">Atif's Codeworks</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" bgcolor="#f8fafc" style="padding: 24px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                © ${new Date().getFullYear()} Atif's Codeworks. All rights reserved.
              </p>
              <p style="margin: 8px 0 0; font-size: 12px; color: #64748b;">
                Please direct replies to: <a href="mailto:mratif00007@gmail.com" style="color: #0284c7; text-decoration: none;">mratif00007@gmail.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
