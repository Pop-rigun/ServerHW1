// TODO:
//      Add a listener to changes in positions' state (add, remove)
//      (Note: you need to emit events when a new position added and an existing position removed)
//      This listener will send emails to all 'interested' applicants.
//      Use npm library such as 'sendmail', 'nodemailer' etc.
//      (Note: do not store your email and password in the code.)
//      (check README.md for additional information)
const fs = require('fs');
const nodemailer =  require('nodemailer')


    const transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true,
        auth: {
            user: '<email>@mail.ru',
            pass: '<password>'
        }
    });
  

async function findApp (pos,text) {
    const temp = await fs.promises.readdir('./db/applicants')
    temp.forEach(async (file) => {
        const data = await fs.promises.readFile('./db/applicants/'+file,'utf-8')
        const appl = JSON.parse(data)
        if(pos.japaneseRequired == 'true' && appl.japaneseKnowledge == 'true' || !pos.japaneseRequired == 'false') {
            if(pos.level == appl.level) {
                if(appl.categories.includes(pos.category)) {
                    const position = JSON.stringify(pos)
                    console.log(position)
                    await transporter.sendMail({
                        from: '<email>@mail.ru', 
                        to: '<email>@mail.ru', 
                        subject: text, 
                        text: `Hello! ${text}: ${position}`, 
                      });
                }
            }
        }
    })
}


module.exports = findApp