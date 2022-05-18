import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
    try {
        // console.log("REQ.BODY", req.body);
        console.log("req.body.message: ", req.body.message);
        await sendgrid.send({
            to: "ruse.marshall@gmail.com", // Your email where you'll receive emails
            from: "inquiries@snazzystones.ca", // your website email address here
            subject: `${req.body.subject}`,
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
                                <h3><span style="color: #526996">${req.body.name}</span> (<span style="color: #14b6b8">${req.body.email}</span>) has a question:</h3>
                            <div style="font-size: 16px;">
                            <p style="white-space: pre-line">${req.body.message}</p>
                            </div>                            
                    </body>
                    </html>`,
        });
    } catch (error) {
        // console.log(error);
        return res.status(error.statusCode || 500).json({ error: error.message });
    }

    return res.status(200).json({ error: "" });
}
