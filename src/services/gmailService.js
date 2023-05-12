import nodemailer from 'nodemailer'
require('dotenv').config()
const fs = require('fs');


let postEmail = (data, date, doctorName, timeAppoint, language, link) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.example.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    let setEmailBody = (language) => {
        let result = ''
        if (language === 'vi') {
            result = `<h1 style="color: red;">
            Xin chào ${data.firstName} ${data.lastName}!</h1>
            <p>Tin nhắn được dịch tự động bằng Google Translate</p>
            <p>Cảm ơn bạn đã đặt lịch khám tại trang web của chúng tôi.</p>
            <p>Bác sỹ đã đặt: ${doctorName}</p>
            <p>Thời gian: ${timeAppoint} ${date}</p>
            <p>Để xác nhận lịch hẹn, hãy ấn vào đường dẫn sau.</p>
            <a href=${link}>Ấn ngay</a>`
        } else {
            result = `<h1 style="color: red;">
            Hello ${data.firstName} ${data.lastName}!</h1>
            <p>Message is automatically translated by Google Translate</p>
            <p>Thank you for booking appointment in my website</p>
            <p>Doctor booked: ${doctorName}</p>
            <p>Time: ${timeAppoint} ${date}</p>
            <p>For confirm your appointment , please click the link below.</p>
            <a href=${link}>CLICK ME</a>`
        }
        return result
    }

    let mailOptions = {
        from: 'hungnguyenbn002@gmail.com',
        to: data.email,
        subject: 'Đặt lịch khám thành công',
        text: 'Cảm ơn đã đặt lịch',
        html: setEmailBody(language)

    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


let postEmailPrescription = (email, date, language, filePrescription) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.example.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    let setEmailBody = (language) => {
        let result = ''
        if (language === 'vi') {
            result = `<h1 style="color: red;"> Cảm ơn </h1>
            <p>Tin nhắn được dịch tự động bằng Google Translate</p>
            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</p>
            <p>Thời gian: ${date}</p>
            <p>Bạn nhớ uống thuốc và uống thuốc theo đơn bác sỹ kê</p>
            <p>Đơn thuốc bên dưới </p> `
        } else {
            result = `<h1 style = "color: red;" > Thank you </h1>
            <p>Message is automatically translated by Google Translate</p>
            <p>Thank you for using our service</p>
            <p>Time: ${date}</p>
            <p>Remember to take your medication in full and take it as prescribed.</p>
            <p>Prescription below </p>`
        }
        return result
    }

    let mailOptions = {
        from: 'hungnguyenbn002@gmail.com',
        to: email,
        subject: 'Đã khám thành công',
        text: 'Cảm ơn đã sử dụng dịch vụ của chúng tôi',
        html: setEmailBody(language),
        attachments: [
            {   // encoded string as an attachment
                filename: 'prescription.jpg',
                content: filePrescription.split("base64,")[1],
                encoding: 'base64'
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    postEmail,
    postEmailPrescription
}