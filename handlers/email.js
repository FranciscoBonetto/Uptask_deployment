const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass // generated ethereal password
    }
  });

//generar html
const generarHTML = (archivo, opciones = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    return juice(html);
}

exports.enviar = async (opciones) => {
    const html = generarHTML(opciones.archivo, opciones );
    const text = htmlToText.fromString(html);
    let OpcionesEmail = {//esto sirve para ver si al ejecutar el pryecto llega el mail a mailtraper
        from: 'UpTask <no-reply@uptask.com>', 
        to: opciones.usuario.email, 
        subject: opciones.subject, 
        text,
        html
    };

    const enviarEmail = util.promisify(transport.sendMail, transport);
    return enviarEmail.call(transport, OpcionesEmail);
}

//Si dejamos esto solo descomentado nos sirve de ejemplo para probar con la pagina de mailtrap
// let OpcionesEmail = {//esto sirve para ver si al ejecutar el pryecto llega el mail a mailtraper
// from: 'UpTask <no-reply@uptask.com>', 
// to: "correo@correo.com", 
// subject: "Password Reset", 
// text: "Hola", 
// html: generarHTML() 
// };
//transport.sendMail(OpcionesEmail);