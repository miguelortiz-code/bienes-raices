import nodemailer from "nodemailer";

const emailRegistro = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port:  process.env.EMAIL_PORT,
    auth: {
      user:  process.env.EMAIL_USER,
      pass:  process.env.EMAIL_PASSWORD,
    },
  });

  const { name, email, token } = data;

  // Enviar email
  await transport.sendMail({
    from: "Bienes raices NodeJs",
    to: email,
    subject: "Confirma tú cuenta en la plataforma de bienes racices",
    text: "Para confirmar la cuenta realiza los siguiente pasos",
    html: `
            <p>Bienvenid@ ${name}, comprueba tu cuenta en bienesRaices.com</p>

            <p>Tú cuenta ya está lista, da click en el siguiente enlace para continuar
                <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar cuenta</a>
            </p>

            <p>Si no te has registrado en bienesRaices ignora este mensaje</p>
        `,
  });
};

export { emailRegistro };