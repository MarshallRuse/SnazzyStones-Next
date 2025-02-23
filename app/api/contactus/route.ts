import sendgrid from '@sendgrid/mail';
import { NextResponse } from 'next/server';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
    try {
        const body = await request.json();

        await sendgrid.send({
            to: 'snazzystones@gmail.com',
            from: 'inquiries@snazzystones.ca',
            subject: `${body.subject}`,
            html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                    <html lang="en">
                    <head>
                        <meta charset="utf-8">
                        <title>Snazzy Stones Inquiries</title>
                        <meta name="description" content="An inquiry message from snazzystones.ca">
                        <meta name="author" content="Snazzystones.ca">
                        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                        <link rel="stylesheet" href="css/styles.css?v=1.0">
                    </head>
                    <body>
                        <div class="container" style="margin-left: 20px;margin-right: 20px;">
                            <h3><span style="color: #526996">${body.name}</span> (<span style="color: #14b6b8">${body.email}</span>) has a question:</h3>
                            <div style="font-size: 16px;">
                                <p style="white-space: pre-line">${body.message}</p>
                            </div>                            
                    </body>
                    </html>`,
        });

        return NextResponse.json({ error: '' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 });
    }
}
