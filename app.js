if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_KEY)
const port = process.env.PORT || 4502

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));

app.get('/')

app.get('/contact')

app.post('/contact')

app.get('/donate', (req, res) => {
    res.sendFile('public/donate.html', { root: __dirname })
})

app.post('/donate', async (req, res, next) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 2000,
        currency: 'usd',
        payment_method_types: ['card'],
    });
    res.json({ clientSecret: paymentIntent.client_secret })
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})