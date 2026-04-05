import nodemailer from "nodemailer";
import dns from "dns";

// Enforce IPv4 DNS resolution. Render's network stack often throws ENETUNREACH if Node v18+ attempts 
// to automatically route outgoing SMTP traffic through IPv6.
dns.setDefaultResultOrder("ipv4first");

export const sendInviteEmail = async (email, companyName, role, inviteLink) => {
  try {
    // In a real application, replace with actual SMTP credentials
    // For now we will create a test account or just log if env vars are missing
    let transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Create a test account if no SMTP configured
      try {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        console.log("No SMTP configured. Using Ethereal Email for testing.");
      } catch (err) {
        console.log("Falling back to console logging for email");
      }
    }

    const mailOptions = {
        from: '"FinSight" <noreply@finsight.com>',
        to: email,
        subject: `You have been invited to join ${companyName} on FinSight`,
        text: `You have been invited to join ${companyName} on FinSight as a ${role}.\nClick below to set your password and activate your account:\n${inviteLink}`,
        html: `<p>You have been invited to join <strong>${companyName}</strong> on FinSight as a <strong>${role}</strong>.</p>
               <p>Click below to set your password and activate your account:</p>
               <a href="${inviteLink}">${inviteLink}</a>`,
    };

    if (transporter) {
        const info = await transporter.sendMail(mailOptions);
        console.log("Invite email sent: %s", info.messageId);
        if (info.messageId && nodemailer.getTestMessageUrl) {
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
    } else {
        console.log("--- EMAIL MOCK ---");
        console.log("To:", email);
        console.log("Subject:", mailOptions.subject);
        console.log("Body:", mailOptions.text);
        console.log("------------------");
    }
  } catch (error) {
    console.error("Error sending invite email:", error);
    // don't throw here to avoid failing the whole request just because email failed
  }
};

export const sendInvoiceEmail = async (email, companyName, invoiceNumber, pdfDataUri) => {
  try {
    let transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      try {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
      } catch (err) {}
    }

    const mailOptions = {
        from: '"FinSight" <noreply@finsight.com>',
        to: email,
        subject: `Invoice #${invoiceNumber} from ${companyName}`,
        text: `Please find attached your invoice #${invoiceNumber} from ${companyName}.\nThank you for your business!`,
        html: `<p>Please find attached your invoice <strong>#${invoiceNumber}</strong> from <strong>${companyName}</strong>.</p>
               <p>Thank you for your business!</p>`,
        attachments: [
            {
                filename: `Invoice_${invoiceNumber}.pdf`,
                path: pdfDataUri
            }
        ]
    };

    if (transporter) {
        const info = await transporter.sendMail(mailOptions);
        console.log("Invoice email sent: %s", info.messageId);
        if (info.messageId && nodemailer.getTestMessageUrl) {
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
        return true;
    } else {
        console.log("--- EMAIL MOCK ---");
        console.log("To:", email);
        console.log("Subject:", mailOptions.subject);
        console.log("Attached PDF Base64 string length:", pdfDataUri?.length);
        console.log("------------------");
        return true;
    }
  } catch (error) {
    console.error("Error sending invoice email:", error);
    throw error;
  }
};
