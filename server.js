const app = require('express')();
const PORT = 3000;


app.get('/', (req, res) => {
    res.send('Hello node api');
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

