if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_KEY)
const port = process.env.PORT || 4502
const nodemailer = require('nodemailer')


app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile('public/views/index.html', { root: __dirname })
})

app.get('/about-us', (req, res) => {
    res.sendFile('public/views/about-us.html', { root: __dirname })
})

app.get('/boats', (req, res) => {
    res.sendFile('public/views/boats.html', { root: __dirname })
})

app.get('/auto', (req, res) => {
    res.sendFile('public/views/auto.html', { root: __dirname })
})

app.get('/other', (req, res) => {
    res.sendFile('public/views/other.html', { root: __dirname })
})

app.get('/irs-guide', (req, res) => {
    res.sendFile('public/views/irs-guide.html', { root: __dirname })
})



app.get('/contact', (req, res) => {
    res.sendFile('public/views/contact.html', { root: __dirname })
})

app.post('/contact', async (req, res, next) => {
    const { form, body } = req.body
    let message = `Form: ${form}`
    for (let input in body) {
        message += `\n${input}: ${body[input]}`
    }
    try {
        let transporter = nodemailer.createTransport({
            // host: "smtp.gmail.com",
            // port: 587,
            // secure: false, // true for 465, false for other ports
            service: "gmail",
            // host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.USERNAME,
                pass: process.env.PASS,
            },
        });
        let info = await transporter.sendMail({
            from: '"dvarinstitute.org"',
            to: 'yofried@gmail.com',
            replyTo: body.email,
            subject: "New Contact Form",
            text: `${message}\n\n sent from dvarinstitute.org contect form \n Developed by Aaron Skriloff`,

        })
            .then(info => {
                res.status(200).json({ message: info, error: false })
            })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: e, error: true })
    }

})

app.get('/donate', (req, res) => {
    res.sendFile('public/views/donate.html', { root: __dirname })
})

app.post('/donate', async (req, res, next) => {
    console.log(req.body)
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: `${req.body.amount}00`,
            currency: 'usd',
            payment_method_types: ['card'],
            receipt_email: req.body.receipt_email,
            description: "Yeshiva D'Var Yeshorim The D'var Institute: Tax I.D. No. 112511058,\nThank you for your generous donation. We appreciate your kindness and thank you for your consideration. Thank you."
        });
        res.json({ clientSecret: paymentIntent.client_secret, error: false })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: true })
    }


})

app.use((req, res, next) => {
    res.redirect('/')
})

app.use((err, req, res, next) => {
    res.redirect('/')
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})