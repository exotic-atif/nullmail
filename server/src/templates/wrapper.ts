export function generateEmailHTML(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <title>Atif's Codeworks</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      background-color: #0f172a;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    
    img {
      border: 0;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }

    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #0f172a;
      padding: 40px 20px;
    }

    .main-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
    }

    .header {
      background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
      padding: 48px 32px;
      text-align: center;
    }
    
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.5px;
      line-height: 1.2;
    }

    .header p {
      margin: 12px 0 0;
      color: rgba(255, 255, 255, 0.9);
      font-size: 15px;
      font-weight: 500;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .content {
      padding: 48px 40px;
      background-color: #ffffff;
    }

    .content-inner {
      font-size: 16px;
      line-height: 1.7;
      color: #334155;
    }

    .content-inner h1, .content-inner h2, .content-inner h3 {
      color: #0f172a;
      font-weight: 600;
      margin-top: 0;
    }

    .content-inner a {
      color: #0ea5e9;
      text-decoration: none;
      font-weight: 500;
    }

    .signature {
      margin-top: 48px;
      padding-top: 32px;
      border-top: 1px solid #e2e8f0;
    }
    
    .signature-grid {
      width: 100%;
    }

    .signature-text p {
      margin: 0;
    }

    .signature-regards {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 8px !important;
    }

    .signature-name {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.2px;
    }

    .signature-title {
      font-size: 14px;
      font-weight: 600;
      color: #0ea5e9;
      margin-top: 4px !important;
    }

    .footer {
      background-color: #f8fafc;
      padding: 32px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }

    .footer p {
      margin: 0;
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.6;
    }

    .footer a {
      color: #64748b;
      text-decoration: underline;
    }

    @media screen and (max-width: 600px) {
      .wrapper {
        padding: 20px 10px !important;
      }
      .header {
        padding: 40px 20px !important;
      }
      .content {
        padding: 32px 24px !important;
      }
      .footer {
        padding: 24px 20px !important;
      }
      .header h1 {
        font-size: 26px !important;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table class="main-container" width="100%" border="0" cellspacing="0" cellpadding="0">
            <!-- Header -->
            <tr>
              <td class="header">
                <h1>Atif's Codeworks</h1>
                <p>Where Ideas Become Interfaces</p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td class="content">
                <div class="content-inner">
                  ${content}
                </div>

                <!-- Signature -->
                <div class="signature">
                  <table class="signature-grid" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td class="signature-text">
                        <p class="signature-regards">Best regards,</p>
                        <p class="signature-name">Atif Arman</p>
                        <p class="signature-title">Atif's Codeworks</p>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td class="footer">
                <p>© ${new Date().getFullYear()} Atif's Codeworks. All rights reserved.</p>
                <p style="margin-top: 8px;">Please direct replies to: <a href="mailto:mratif00007@gmail.com">mratif00007@gmail.com</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `;
}
