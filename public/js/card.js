document.addEventListener('DOMContentLoaded', async () => {
    // const stripe = Stripe('pk_live_51Jn4FzHz9WyEjJGIJDxEdJLplRnYMq3pZROcP0PzEtXV6pq73bLtGf33LZ1RyiewGq8hHAS1qFmEZqbRY0NKzIrk00KLlJdiyc')
    const stripe = Stripe('pk_test_51Jn4FzHz9WyEjJGIlLuLGi30mh7aly4pI2abZiAdt955iaISvcrIifGvpLOEk3bUtLSWkQuc87Qtt2cldn5OQjt100vqwSpGeJ')
    const elements = stripe.elements()
    const cardElement = elements.create('card', {
        style: {
            base: {
                // iconColor: '#c4f0ff',
                color: '#000',
                fontWeight: '500',
                fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                fontSize: '16px',
                fontSmoothing: 'antialiased',
                ':-webkit-autofill': {
                    color: '#fce883',
                },
                '::placeholder': {
                    color: '#7f7f7f',
                },
            },
            invalid: {
                iconColor: '#FFC7EE',
                color: '#FFC7EE',
            },
        },
    })
    cardElement.mount('#card-element')
    const nameInput = document.querySelector('#name')
    const emailInput = document.querySelector('#email')
    const form = document.querySelector('#donate-form')
    const fail = document.querySelector('#fail')
    const success = document.querySelector('#success')

    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const btn = document.querySelector('#submit')
        btn.value = btn.dataset["wait"]
        fail.style.display = "none"

        let intent = await fetch('/donate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                paymentMethodType: 'card',
                currency: 'usd',
                amount: Math.floor(document.querySelector('#amount').value),
                receipt_email: emailInput.value,
            })
        }).then(r => r.json())
        if (!intent.error) {
            const paymentIntent = await stripe.confirmCardPayment(intent.clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: nameInput.value,
                        email: emailInput.value
                    }

                }
            })
            if (paymentIntent.error) {
                console.log(paymentIntent.error.message)
                fail.style.display = "block";
                success.style.display = "none";
                fail.innerText = paymentIntent.error.message

            } else {
                fail.style.display = "none"
                success.style.display = "block";
                btn.remove()
            }
        } else {
            fail.style.display = "block";
            success.style.display = "none";
        }
    })

})