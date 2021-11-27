if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_KEY)
const port = process.env.PORT || 4502

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    console.log("hit")
    res.sendFile('public/index.html', { root: __dirname })
})

app.get('/contact', (req, res) => {
    res.sendFile('public/contact.html', { root: __dirname })
})

app.post('/contact', async (req, res, next) => {
    const { name, email, message } = body
    try {
        let transporter = nodemailer.createTransport({
            // host: "smtp.gmail.com",
            // port: 587,
            // secure: false, // true for 465, false for other ports
            service: "gmail",
            auth: {
                user: '',
                pass: process.env.PASS,
            },
        });
        let info = await transporter.sendMail({
            from: '"Tatzmichu.org" <tatzmichu@gmail.com> ',
            to: 'office@tatzmichu.org',
            replyTo: email,
            subject: "New Contact Form",
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\n\n sent from tatzmichu.org contect form \n Developed by Aaron Skriloff`,

        })
            .then(info => {
                res.status(200).json({ message: info })
            })
    } catch (e) {
        res.status(500).send({ message: e })
    }

})

app.get('/donate', (req, res) => {
    res.sendFile('public/donate.html', { root: __dirname })
})

app.post('/donate', async (req, res, next) => {
    const { amount } = req.body
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method_types: ['card'],
    });
    res.json({ clientSecret: paymentIntent.client_secret })
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