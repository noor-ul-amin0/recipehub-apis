import nodemailer from "nodemailer";
import { EmailToken } from "../types/user";
import { generateVerificationEmailToken } from "../helpers/auth";
import { Recipe } from "../types/recipe";

export default class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: parseInt(process.env.MAILTRAP_PORT ?? "0", 10),
      auth: {
        user: process.env.MAILTRAP_AUTH_USER,
        pass: process.env.MAILTRAP_AUTH_PASS,
      },
    });
  }

  async sendVerificationEmail(toUser: EmailToken): Promise<void> {
    try {
      const verificationLink =
        process.env.APP_BASE_URL +
        "/auth/verify/email/" +
        generateVerificationEmailToken(toUser);
      const mailOptions = {
        from: process.env.MAILTRAP_SENDER_EMAIL,
        to: toUser.email,
        subject: "Your Email Verification Link (valid for 1 hour)",
        message: "Write PUT request to this URL to verify your email",
        html: `
       <center>
       <p>Dear ${toUser.full_name},\n\nThank you for signing up. Please click the link to verify your account: ${toUser.email}/verify\n\nRegards,\nRecipeHub</p>
       <h3>Email verification link is as follows:</h3> <br>
       <h4>Send a PUT request to this URL to verify your email</h4> <br>
       <p href="${verificationLink}">${verificationLink}</p>
       </center
    `,
      };
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("Error occurred while sending email: ", error);
    }
  }
  public async sendRecipeAddedEmailNotification(
    toUser: EmailToken,
    recipe: Recipe
  ): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.MAILTRAP_SENDER_EMAIL,
        to: toUser.email,
        subject: "Recipe Added Notification",
        html: `
      <center>
        <p>Dear ${toUser.full_name},</p>
        <p>A new recipe has been added:</p>
        <p><b>Title:</b> ${recipe.title}</p>
        <p><b>Description:</b> ${recipe.description}</p>
        <p>Regards,</p>
        <p>RecipeHub</p>
      </center>
      `,
      };
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("Error occurred while sending email: ", error);
    }
  }
}
