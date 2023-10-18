// const express = require('express')
// const bodyParser = require('body-parser')
// const app = express()
// const book = require('./book');
// const cors = require('cors');
// const dotenv = require('dotenv');
// dotenv.config();



// const multer = require('multer');
// const upload = multer();
// //const storage = multer.memoryStorage();
// //const upload = multer({ storage });

// const port = `${process.env.PORT}`;

// app.use(bodyParser.json());
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );


// app.use(cors({
//   origin : `${process.env.CLIENT_ORIGIN}`
// }));

// app.get('/', (request, response) => {
//     response.json({ info: 'Node.js, Express, and Postgres API' })
//   })

//   app.get('/api/books',book.getBooks);
//   app.post('/api/addnewbook',upload.single('file'),book.addNewBook);
//   app.post('/api/editbook',upload.single('file'),book.editBook);

//   app.listen(port, () => {
//     console.log(`App running on port ${port}.`)
//   })

c// index.js
const express = require('express')

const app = express()
const PORT = 4000

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})

app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})

app.get('/about', (req, res) => {
  res.send('This is my about route..... ')
})

// Export the Express API
module.exports = app