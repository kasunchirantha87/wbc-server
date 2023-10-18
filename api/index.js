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

const app = require('express')();
const { v4 } = require('uuid');

app.get('/api', (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get('/api/item/:slug', (req, res) => {
  const { slug } = req.params;
  res.end(`Item: ${slug}`);
});

module.exports = app;