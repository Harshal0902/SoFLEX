import { type NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'

export async function POST(request: NextRequest) {
    const myEmail = process.env.NEXT_PUBLIC_PERSONAL_EMAIL;
    const password = process.env.NEXT_PUBLIC_EMAIL_PASSWORD;
    const email2 = 'singhdivyanshu917@gmail.com';

    const { user_address, token_name, tokne_amount } = await request.json();

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: myEmail,
            pass: password,
        },
    });

    const mailOptions: Mail.Options = {
        from: myEmail,
        to: myEmail,
        cc: email2,
        subject: `Withdraw request from ${user_address} for ${tokne_amount} ${token_name} on SoFLEX Portfolio page`,
        html: `
        <div style='background-color: #020817; color: #ffffff; text-align: center; padding: 10px; border-radius: 10px;'>

            <span style='font-size: 2.5em;'>Hello there 👋</span>

            <hr style='border-top: 1px solid #666; width: 80%;'>

            <span style='font-size: 1.5em;'>Withdraw request from ${user_address} for ${tokne_amount} ${token_name} on SoFLEX Portfolio page</span>

            <p style='text-align: left; font-size: 15px; padding: 4px 20px'>
               User Address: ${user_address}
            </p>

            <p style='text-align: left; font-size: 15px; padding: 0px 20px;'>
                Withdraw Token: ${tokne_amount} ${token_name}
            </p>

            <p style='color: #666; text-align: center;'>
                This email was sent from the SoFLEX Portfolio page.
            </p>
        </div>
            `,
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
