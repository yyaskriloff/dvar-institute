

document.addEventListener('DOMContentLoaded', async () => {
    const stripe = Stripe('pk_test_51Jn4FzHz9WyEjJGIlLuLGi30mh7aly4pI2abZiAdt955iaISvcrIifGvpLOEk3bUtLSWkQuc87Qtt2cldn5OQjt100vqwSpGeJ')
    const elements = stripe.elements()
    const cardElement = elements.create('card')
    cardElement.mount('#card-element')
    const nameInput = document.querySelector('#name')
    const emailInput = document.querySelector('#email')

    const form = document.querySelector('#donate-form')

    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        let { clientSecret } = await fetch('/donate', {
            method: 'POST',
            headers: { contentType: 'application/json' },
            body: JSON.stringify({
                paymentMethodType: 'card',
                currency: 'usd'
            })
        }).then(r => r.json())
        const paymentIntent = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                receipt_email: email,
                billing_details: {
                    name: nameInput.value,
                    email: emailInput.value
                }

            }
        })
        if (paymentIntent.error) {
            console.log(paymentIntent.error.message)
        }

    })

})