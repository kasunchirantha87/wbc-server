const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const book = require('./book');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();



const multer = require('multer');

const upload = multer();
//const storage = multer.memoryStorage();
//const upload = multer({ storage });

const port = `${process.env.PORT}`;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


app.use(cors({
  origin : `${process.env.CLIENT_ORIGIN}`
}));

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })

  app.get('/books',book.getBooks);
  app.post('/api/addnewbook',upload.single('file'),book.addNewBook);
  app.post('/api/editbook',upload.single('file'),book.editBook);

  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })