document.addEventListener('DOMContentLoaded', async () => {
    const form = document.querySelector('#form')
    const success = document.querySelector('#success')
    const fail = document.querySelector('#fail')
    const nameInput = document.querySelector('#name')
    const emailInput = document.querySelector('#email')
    const messageInput = document.querySelector('#message')


    form.addEventListener('submit', async e => {
        e.preventDefault()
        const btn = document.querySelector('#submit-btn')
        let email = await fetch('/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: nameInput.value,
                email: emailInput.value,
                message: messageInput.value
            })
        }).then(r => r.json())
        if (!email.error) {
            fail.style.display = "none"
            success.style.display = "block";
            btn.remove()
        } else {
            fail.style.display = "block";
            success.style.display = "none";
        }
    })
})