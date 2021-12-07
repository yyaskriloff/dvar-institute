const form = document.querySelector('#form')
const success = document.querySelector('#success')
const fail = document.querySelector('#fail')
const inputs = document.querySelectorAll('.input')


form.addEventListener('submit', async e => {
    e.preventDefault()
    const body = {}
    for (let input of inputs) {
        body[input.name] = input.value
    }
    const btn = document.querySelector('#submit-btn')
    let formSubmit = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            form: form.dataset["name"],
            body,

        })
    }).then(r => r.json())
    if (!formSubmit.error) {
        fail.style.display = "none"
        success.style.display = "block";
        btn.remove()
    } else {
        fail.style.display = "block";
        success.style.display = "none";
    }
})