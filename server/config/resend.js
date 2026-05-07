import { Resend } from "resend";
const resendClient = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async (email) => {
  try {
    const result = await resendClient.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Welcome to Study Tracker!",
      html: `<h2>Welcome to Study Tracker!</h2>
             <p>Thank you for registering. Your account has been created successfully.</p>
             <p>You can now login and start managing your tasks and studies.</p>
             <p>Best regards,<br/>Study Tracker Team</p>`,
    });
    console.log("Welcome email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);

    return null;
  }
};
