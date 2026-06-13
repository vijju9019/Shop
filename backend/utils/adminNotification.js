const sendAdminNotification = async (order) => {
  const adminPhone = process.env.ADMIN_PHONE_NUMBER || '919272501980';
  const provider = process.env.SMS_PROVIDER || 'none';
  const fast2smsKey = process.env.FAST2SMS_API_KEY;
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
  const twilioWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER;

  // Format order items list
  const itemsText = order.orderItems
    .map((item) => `${item.name} x${item.qty}`)
    .join(', ');

  // Format notification message
  const messageText = `Nitro Hub - New Order Received! 🚀\n\nOrder ID: ${order._id.toString().substring(0, 8).toUpperCase()}\nAmount: ₹${order.totalAmount.toFixed(2)}\nDiscord: @${order.customerDetails.discordUsername}\nCustomer: ${order.customerDetails.name}\nItems: ${itemsText}\nPayment: ${order.paymentStatus.toUpperCase()} (Ref: ${order.razorpayPaymentId || 'N/A'})\n\nReview in Admin Panel: http://localhost:5173/admin`;

  try {
    let sent = false;

    if (provider === 'fast2sms' && fast2smsKey) {
      try {
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': fast2smsKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            route: 'q',
            message: messageText,
            language: 'english',
            numbers: adminPhone
          })
        });
        const data = await response.json();
        if (data.return) {
          sent = true;
          console.log(`[SMS Notification] Sent order alert successfully via Fast2SMS to admin: ${adminPhone}`);
        } else {
          console.error('[SMS Notification] Fast2SMS returned error:', data.message);
        }
      } catch (err) {
        console.error('[SMS Notification] Fast2SMS error:', err);
      }
    } else if (provider === 'twilio' && twilioSid && twilioToken) {
      try {
        const twilio = (await import('twilio')).default;
        const client = new twilio(twilioSid, twilioToken);

        if (twilioWhatsApp) {
          // Send via WhatsApp
          await client.messages.create({
            body: messageText,
            to: `whatsapp:${adminPhone.startsWith('+') ? adminPhone : '+' + adminPhone}`,
            from: `whatsapp:${twilioWhatsApp}`
          });
          sent = true;
          console.log(`[WhatsApp Notification] Sent order alert successfully via Twilio to admin: ${adminPhone}`);
        } else if (twilioPhone) {
          // Send via SMS
          await client.messages.create({
            body: messageText,
            to: adminPhone.startsWith('+') ? adminPhone : `+${adminPhone}`,
            from: twilioPhone
          });
          sent = true;
          console.log(`[SMS Notification] Sent order alert successfully via Twilio to admin: ${adminPhone}`);
        }
      } catch (err) {
        console.error('[SMS Notification] Twilio error:', err);
      }
    }

    if (!sent) {
      // Sandbox fallback console log
      console.log('\n==================================================');
      console.log('🔔 [ADMIN NOTIFICATION ALERT] (Sandbox Console Log) 🔔');
      console.log('--------------------------------------------------');
      console.log(messageText);
      console.log('==================================================\n');
    }
  } catch (error) {
    console.error('Error in sendAdminNotification:', error);
  }
};

export default sendAdminNotification;
