import { type NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { render } from '@react-email/render'
import { ContactUs } from '@/email/ContactUs'

export async function POST(request: NextRequest) {
    const myEmail = process.env.PERSONAL_EMAIL;
    const password = process.env.EMAIL_PASSWORD;
    const email2 = 'singhdivyanshu917@gmail.com';

    const { email, name, message } = await request.json();

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: myEmail,
            pass: password,
        },
    });

    const emailHtml = render(ContactUs({ email, name, message }));

    const mailOptions: Mail.Options = {
        from: myEmail,
        to: myEmail,
        cc: email2,
        replyTo: email,
        subject: `Message from ${name} (${email}) on SoFLEX Contact Us page`,
        html: emailHtml
    };

    const sendMailPromise = () =>
        new Promise<string>((resolve, reject) => {
            transport.sendMail(mailOptions, function (err) {
                if (!err) {
                    resolve('Message sent successfully!');
                } else {
                    reject(err.message);
                }
            });
        });

    try {
        await sendMailPromise();
        return NextResponse.json({ message: 'Message sent successfully!' });
    } catch (err) {
        return NextResponse.json({ error: err }, { status: 500 });
    }
}
