import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

export async function sendOtpEmail(to, otp) {
  if (!process.env.SMTP_USER) {
    console.log(`[EMAIL MOCK] To: ${to} — OTP: ${otp}`);
    return;
  }
  await transporter.sendMail({
    from: `"Centeric Solutions" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your verification code",
    text: `Your verification code is: ${otp}\n\nThis code expires in 10 minutes.`,
    html: `<div style="font-family:sans-serif;padding:24px;max-width:480px">
      <h2 style="margin:0 0 12px">Verify your email</h2>
      <p style="color:#5B6172">Use the code below to complete your registration:</p>
      <div style="font-size:32px;font-weight:800;letter-spacing:6px;text-align:center;padding:20px;background:#f6f4f0;border-radius:12px;margin:16px 0">${otp}</div>
      <p style="color:#5B6172;font-size:13px">This code expires in 10 minutes.</p>
    </div>`,
  });
}
