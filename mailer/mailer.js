const nodemailer = require('nodemailer');

const mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'lula.daugherty@ethereal.email',
        pass:'CmJCYduMKkBKwYt4wT',
    }
};
module.exports = nodemailer.createTransport(mailConfig);