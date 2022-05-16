import nodemailer from "nodemailer";

export default function handler(req, res) {
    //const transporter = nodemailer.createTransport({});

    console.log(req.body);
    res.status(200).json(req.body);
}
