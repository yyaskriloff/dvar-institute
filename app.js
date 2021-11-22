const express = require('express');
const app = express();
const port = process.env.PORT || 5000

app.use((req, res, next) => {
    res.send("We made it boiz!")
})

app.listen(port, () => {
    console.log(`listening on ${port}`)
})