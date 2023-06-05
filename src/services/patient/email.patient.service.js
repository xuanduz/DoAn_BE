require("dotenv").config();
import nodemailer from "nodemailer";

let sendEmailToVerify = async (dataSend) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASS, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Health Check" <xuanduc9421@gmail.com>', // sender address
    to: dataSend.receiverEmail, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh",
    html: `
    <h3>Xin chào ${dataSend.fullName}</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên website Health Check</p>
    <p>Thông tin đặt lịch khám bệnh:</p>
    <p>${dataSend.time}, ngày ${dataSend.date}</p>
    <p>Bác sĩ ${dataSend.doctorName}</p>
    <p>Nếu thông tin trên đúng sự thật, vui lòng nhấn vào đường link sau đây để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.</p>
    <div>
      <a href="${process.env.REACT_APP_HOST}/verify-email?patientId=${dataSend.patientId}&date=${dataSend.date}&timeSlot=${dataSend.timeSlot}&doctorId=${dataSend.doctorId}" target="_blank">Nhấn vào đây</a>
    </div>
    <p>Xin chân thành cảm ơn !</p>
    `,
  });
};

let sendEmailToNewPass = async (data) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASS, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Health Check" <xuanduc9421@gmail.com>', // sender address
    to: data.email, // list of receivers
    subject: "Quên mật khẩu ?",
    html: `
    <h3>Xin chào ${data.email}</h3>
    <p>Bạn nhận được email này vì đã thực hiện quên mật khẩu trên trang web Health Check</p>
    <p>Mã số của bạn là</p>
    <h2>${data.code}</h2>
    <p>Xin chân thành cảm ơn !</p>
    `,
  });
};

module.exports = {
  sendEmailToVerify: sendEmailToVerify,
  sendEmailToNewPass: sendEmailToNewPass,
};
