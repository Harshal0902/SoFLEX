import { type NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { render } from '@react-email/render'
import { WithdrawToken } from '@/email/WithdrawToken'

export async function POST(request: NextRequest) {
    const myEmail = process.env.PERSONAL_EMAIL;
    const password = process.env.EMAIL_PASSWORD;
    const email2 = 'singhdivyanshu917@gmail.com';

    const { user_address, token_name, tokne_amount } = await request.json();

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: myEmail,
            pass: password,
        },
    });

    const emailHtml = render(WithdrawToken({ user_address, token_name, tokne_amount }));

    const mailOptions: Mail.Options = {
        from: myEmail,
        to: myEmail,
        cc: email2,
        subject: `Withdraw request from ${user_address} for ${tokne_amount} ${token_name} on SoFLEX Portfolio page`,
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
