import * as sgMail from "@sendgrid/mail"

if (process.env.SENDGRID_API_KEY)
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendEmail = async (mail: {
    from: string,
    subject: string,
    text: string,
    name: string
}) => {
    console.log(mail)
    await sgMail
        .send({
            ...mail,
            html: mail.text?.replace(/\r\n/g, '<br>') || "",
            to: "me@vahor.fr",
            subject: `[Vahor.fr] - ${mail.from} (${mail.name}) - ${mail.subject}`
        })
}