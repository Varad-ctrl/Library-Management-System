const express = require('express');

const app = express();

app.use(express.json());

const port = 8081;

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Home Page :-)"
    })
})

// app.all('*', (req, res) => {
//     res.status(500).json({
//         message: ""
//     })
// })


app.listen(port, () => {
    console.log(`Server is up and running on http://localhost:${port}`);
})

