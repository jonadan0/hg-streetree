const express = require("express")

const app = express()

const port = 2626
app.listen(port, () => {
    console.log(`Server on port ${port}`)
})

