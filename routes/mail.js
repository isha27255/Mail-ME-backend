const express = require("express");
const router = express.Router();
const nodemailer=require('nodemailer');
let Mail=require('../models/mail');
let cron=require('node-cron');
let User=require('../models/user');
require("dotenv").config();
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

router.post("/:id/mail", (req, res) => {

    User.findById(req.params.id)
          .then(user => {
              
             const to = req.body.to;
             const cc = req.body.cc;
             const subject = req.body.subject;
             const schedule = req.body.schedule;
             const mail_body = req.body.mail_body;
             const recur=Number(req.body.recur);
             const date=Date.parse(req.body.date);
             const time=req.body.time;
             const weekly_day=Number(req.body.weekly_day);
            
            let pass=user.encrypt_pass;
            const x=cryptr.decrypt(pass );
              const new_mail = new Mail({to, cc, subject, schedule, recur, date, time, weekly_day, mail_body});
              new_mail.user = user._id;
              new_mail.save()
                  .then(() => res.json("Mail created Successfully"))
                  .catch(err => res.status(400).json("Error is " + err));
             user.mails.push(new_mail._id);
             user.save();
            
        let month=new_mail.date.getMonth()+1;
        let day=new_mail.date.getDate();
        let hour=parseInt(time.substring(0,2));
        let min=parseInt(time.substring(3,5));

        if(schedule.localeCompare("recurring")==0)
        {
            cron.schedule(`*/${recur} * * * * *`, () => {
                let mailOptions = {
                    from: `${user.email}`,
                    to: `jaiswalbhola97@gmail.com, ${cc}`,
                    subject:`${subject}`,
                    text:`${mail_body}`
               };
               let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: user.email,
                  pass: x
                }
            });
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
            });
            });

          
        }
        if(schedule.localeCompare("weekly")==0)
        {
            cron.schedule(`0 ${min} ${hour} * * ${weekly_day}`, () => {
                let mailOptions = {
                    from: `${user.email}`,
                    to: `jaiswalbhola97@gmail.com, ${cc}`,
                    subject:`${subject}`,
                    text:`${mail_body}`
               };
               let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: user.email,
                  pass: x
                }
            });
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
            });
            });
        }
        else if(schedule.localeCompare("monthly")==0)
        {
            cron.schedule(`0 ${min} ${hour} ${day} * *`, () => {
                let mailOptions = {
                    from: `${user.email}`,
                    to: `jaiswalbhola97@gmail.com, ${cc}`,
                    subject:`${subject}`,
                    text:`${mail_body}`
               };
               let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: user.email,
                  pass: x
                }
            });
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
            });
            });
        }
        else if(schedule.localeCompare("yearly")==0)
        {
            cron.schedule(`0 ${min} ${hour} ${day} ${month} *`, () => {
                let mailOptions = {
                    from: `${user.email}`,
                    to: `jaiswalbhola97@gmail.com, ${cc}`,
                    subject:`${subject}`,
                    text:`${mail_body}`
               };
               let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: user.email,
                  pass: x
                }
            });
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
            });
            });
        }
    //     else
    //     {
    //       let mailOptions = {
    //         from: `${user.email}`,
    //         to: `jaiswalbhola97@gmail.com, ${cc}`,
    //         subject:`${subject}`,
    //         text:`${mail_body}`
    //    };
    //    let transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //       user: user.email,
    //       pass: x
    //     }
    // });
    // transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    // });
    //     }
        
             
          })
          .catch(err => res.status(400).json("Error is " + err));  
         
  });

  router.get("/:id/mail/:mid", (req, res) => {
    Mail.findById(req.params.mid)
      .then(mail => res.json(mail))
      .catch(err => res.status(400).json("Error is " + err));       
  });

  //future mails
  router.get("/:id/future-mails", (req, res) => {
   
    const today = new Date();
    const year=today.getFullYear();
    const month=today.getMonth()+1;
    const d=today.getDate();
    Mail.find({ "date": { "$gte": `${year}-${month}-${d}` }, "user": req.params.id})
    .then(data => res.json(data))
    .catch(err => res.status(400).json('Error: ' + err));
  });
  
  //past mails
  router.get("/:id/past-mails", (req, res) => {
   
    const today = new Date();
    const year=today.getFullYear();
    const month=today.getMonth()+1;
    const d=today.getDate();
    Mail.find({ "date": { "$lt": `${year}-${month}-${d}` }, "user": req.params.id})
    .then(data => res.json(data))
    .catch(err => res.status(400).json('Error: ' + err));
  });


module.exports = router;