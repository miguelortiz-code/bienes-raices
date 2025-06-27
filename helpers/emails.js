import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const emailRegister = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.email_host,
    port: process.env.email_port,
    auth: {
      user: process.env.email_user,
      pass: process.env.email_password,
    },
  });

  const { name, email, token } = data;
//   return  console.log('Enviando correo de confirmación a: ', email);

  // Enviar Email
  try{
      await transport.sendMail({
    from: '"Bienes Raíces" <no-reply@bienesraices.com>',
    to: email,
    subject: "Confirma tu cuenta en Bienes Raíces",
    html: `
    <div style="max-width: 600px; margin: 20px auto; padding: 30px; border: 1px solid #e1e1e1; border-radius: 10px; font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333;">
      <h2 style="text-align: center; color: #2c3e50;">Bienes Raíces</h2>
      <p style="font-size: 16px;">Hola <strong>${name}</strong>,</p>
      <p style="font-size: 15px;">
        Gracias por registrarte en <strong>Bienes Raíces</strong>. Para completar tu registro, por favor confirma tu cuenta haciendo clic en el siguiente botón:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.backend_url}:${process.env.backend_port ?? 3000}/auth/confirm-account/${token}" style="background-color: #3498db; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Confirmar Cuenta</a>
      </div>

      <p style="font-size: 14px;">Si tú no creaste esta cuenta, puedes ignorar este mensaje.</p>

      <p style="font-size: 14px;">Atentamente,<br>El equipo de Bienes Raíces</p>
    </div>
  `,
  });
  console.log('Correo enviado correctamente');
  }catch(error){
    console.log(`Error al enviar el correo: ${error}`)
  }
};

export { emailRegister };
