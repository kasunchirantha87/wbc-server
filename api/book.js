const dotenv = require('dotenv');
dotenv.config();
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const Pool = require('pg').Pool
const pool = new Pool({
  user: `${process.env.DB_USER}`,
  host: `${process.env.DB_HOST}`,
  database: `${process.env.DB_DATABSE}`,
  password: `${process.env.DB_PASSWORD}`,
  port: `${process.env.DB_PORT}`,
})


const getBooks = (request, response) => {
  const query = `SELECT * FROM public.books`;
  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addNewBook = async (request,response) => {
    try {
        if (!request.file || Object.keys(request.file).length === 0) {
          return response.status(400).json({ success: false, error: 'No files were uploaded.' });
        }
        
        const id = crypto.randomUUID();

        // Get the file extension
        const fileExtension = path.extname(request.file.originalname);
        const image = id.concat(fileExtension);
        
        const { name, author, language,type,series,originalBook,originalAuthor} = request.body;
        //const client = await pool.connect();
        const result = await pool.query(
          `INSERT INTO public.books (id,name, author, language, type, series,
            original_book, original_author, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [id, name, author, language, type, series, originalBook, originalAuthor, image]
        );
        if(result.rowCount > 0){
          // Create a folder with the book ID as the name
        const bookFolder = path.join(__dirname, '../client/public/images', id.toString());
        if (!fs.existsSync(bookFolder)) {
          fs.mkdirSync(bookFolder);
        }

        // Move the image to the book folder
        const newImagePath = path.join(bookFolder, `${id}${fileExtension}`);
        fs.writeFileSync(newImagePath, request.file.buffer);
    
        return response.status(200).json(id);
        }
        
      } catch (error) {
        console.error('Error:', error);
        return response.status(500).json({ success: false, error: 'An error occurred.' });
      }
}

const editBook = async (request,response) => {
  try {
      const {id, name, author, language,type,series,originalbook,originalauthor} = request.body;
      if (request.file === undefined) {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
        const updateQuery = `UPDATE public.books 
        SET name=$1,author=$2,language=$3
        ,type=$4,series=$5,original_book=$6,
        original_author=$7 WHERE id=$8`;
        await pool.query(updateQuery,[name,author,language,type,
          series,originalbook,originalauthor,id], (err, result) => {
          if (err) {
            console.error('Error executing update query', err);
          } else {
            console.log('Update successful', result.rowCount, 'row(s) affected');
            return response.status(200).json(result.rowCount);
          }
        });
      }
      else{
        console.log(request.file.originalname);
        const dirPath = path.join(__dirname, '../client/public/images', id.toString());

        const files = await fs.promises.readdir(dirPath);

        const deleteFilePromises = files.map(file =>
          fs.unlink(path.join(dirPath, file)),
        );

        Promise.all(deleteFilePromises);

        // Get the file extension
        const fileExtension = path.extname(request.file.originalname);
        const image = id.concat(fileExtension);

        // Move the image to the book folder
        const newImagePath = path.join(dirPath, `${id}${fileExtension}`);
        fs.writeFileSync(newImagePath, request.file.buffer);

        const updateQuery = `UPDATE public.books 
        SET name=$1,author=$2,language=$3
        ,type=$4,series=$5,original_book=$6,
        original_author=$7,image=$8 WHERE id=$9`;

        // const result = await pool.query(updateQuery,[name,author,language,type,
        //   series,originalbook,originalauthor,image,id], (err, result) => {
        //   if (err) {
        //     console.error('Error executing update query', err);
        //   } else {
        //     console.log('Update successful', result.rowCount, 'row(s) affected');
        //     return response.status(200).json(result.rowCount);
        //   }
        // });
        const result = await pool.query(updateQuery, [
          name, author, language, type, series, originalbook, 
          originalauthor, image, id
      ]);
  
      console.log('Update successful', result.rowCount, 'row(s) affected');
      return response.status(200).json(result.rowCount);
      }
  } catch (error) {
    console.error('Error:', error);
        return response.status(500).json({ success: false, error: 'An error occurred.' });
  }
}


module.exports = {
    addNewBook,
    getBooks,
    editBook,
}