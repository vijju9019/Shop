import nodemailer from 'nodemailer';

const sendOrderConfirmationEmail = async (order) => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log('Order created, but email not sent (SMTP environment variables are not configured).');
    console.log(`Order Details for Email:
      To: ${order.customerDetails.email}
      Order ID: ${order._id}
      Discord Username: ${order.customerDetails.discordUsername}
      Total Amount: ₹${order.totalAmount}
    `);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const itemsHtml = order.orderItems
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #2f3136; color: #dcddde;">${item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #2f3136; color: #dcddde; text-align: center;">${item.qty}</td>
        <td style="padding: 12px; border-bottom: 1px solid #2f3136; color: #dcddde; text-align: right;">₹${item.price.toFixed(2)}</td>
      </tr>
    `
      )
      .join('');

    const mailOptions = {
      from: `"Nitro Hub" <${smtpUser}>`,
      to: order.customerDetails.email,
      subject: `Nitro Hub - Order Confirmation #${order._id.toString().substring(0, 8).toUpperCase()}`,
      html: `
        <div style="background-color: #202225; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff; text-align: center;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #2f3136; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.3); text-align: left;">
            <div style="background-color: #5865f2; padding: 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: 1px;">NITRO HUB</h1>
            </div>
            
            <div style="padding: 30px;">
              <h2 style="color: #ffffff; font-size: 20px; margin-top: 0;">Hey ${order.customerDetails.name},</h2>
              <p style="color: #b9bbbe; font-size: 16px; line-height: 1.6;">
                Thank you for purchasing from Nitro Hub! Your payment was successful, and your order has been received. 
              </p>
              
              <div style="background-color: #202225; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0; color: #72767d; font-size: 14px;">ORDER ID</p>
                <p style="margin: 5px 0 0 0; color: #5865f2; font-family: monospace; font-size: 18px; font-weight: bold;">${order._id}</p>
              </div>

              <h3 style="color: #ffffff; font-size: 16px; border-bottom: 2px solid #5865f2; padding-bottom: 8px; margin-top: 30px;">Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                  <tr style="background-color: #202225;">
                    <th style="padding: 10px; text-align: left; color: #72767d; font-size: 12px; text-transform: uppercase;">Service</th>
                    <th style="padding: 10px; text-align: center; color: #72767d; font-size: 12px; text-transform: uppercase;">Qty</th>
                    <th style="padding: 10px; text-align: right; color: #72767d; font-size: 12px; text-transform: uppercase;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding: 12px; font-weight: bold; color: #ffffff; text-align: right;">Total Amount:</td>
                    <td style="padding: 12px; font-weight: bold; color: #5865f2; text-align: right; font-size: 18px;">₹${order.totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>

              <h3 style="color: #ffffff; font-size: 16px; border-bottom: 2px solid #5865f2; padding-bottom: 8px; margin-top: 30px;">Delivery Info</h3>
              <p style="color: #b9bbbe; font-size: 15px; margin: 10px 0;">
                <strong>Discord Username:</strong> <span style="color: #5865f2; font-family: monospace;">${order.customerDetails.discordUsername}</span>
              </p>
              
              <div style="background-color: #202225; padding: 20px; border-radius: 6px; border-left: 4px solid #5865f2; margin-top: 30px; text-align: center;">
                <h4 style="margin: 0 0 10px 0; color: #ffffff; font-size: 16px;">Complete Your Delivery</h4>
                <p style="margin: 0 0 15px 0; color: #b9bbbe; font-size: 14px;">
                  We need to process your order manually. Click the button below to redirect to WhatsApp and message our agent with your Order ID.
                </p>
                <a href="https://wa.me/919272501980?text=Payment%20has%20been%20done.%20My%20Order%20ID%20is%20${order._id}.%20Please%20process%20my%20Discord%20purchase." 
                   style="display: inline-block; background-color: #23d160; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 15px; transition: background-color 0.2s;">
                  Message on WhatsApp
                </a>
              </div>
            </div>
            
            <div style="background-color: #202225; padding: 20px; text-align: center; font-size: 12px; color: #72767d; border-top: 1px solid #2f3136;">
              <p style="margin: 0;">© 2026 Nitro Hub. All rights reserved.</p>
              <p style="margin: 5px 0 0 0;">This website is not affiliated with Discord Inc.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${order.customerDetails.email}`);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
};

export default sendOrderConfirmationEmail;
