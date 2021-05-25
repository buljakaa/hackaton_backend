
const nodemailer = require('nodemailer');

exports.sendEmail = async (user) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'markopoppriboj@gmail.com',
            pass: 'rtgaiuisufjwcoga'
        }
    });

    const userLink = 'http://localhost:3000/auth-user/verify?verificationToken=' + user.verificationToken;
    const info = await transporter.sendMail({
        from: '<HACKATHON>' + '<' + process.env.MAIL_USERNAME + '>',
        to: user.email, // list of receivers
        subject: '[HACKATHON] Aktivirajte Vaš nalog', // Subject line
        html: 'Please click <a href="' + userLink + '"> here </a> to activate your account.'
    });
}