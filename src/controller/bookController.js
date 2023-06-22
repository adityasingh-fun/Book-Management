const BookModel = require('../models/bookModel');
const ReviewModel = require('../models/reviewModel');

//book creation api -

const createBooks = async function (req, res) {
    try {
        data = req.body;
        const { title, excerpt, userId, ISBN, category, subcategory, reviews, deletedAt, isDeleted, releasedAt} = data
        
        const existingBook = await BookModel.findOne({ title: title });
        if (existingBook) {
          return res.status(400).json({ status: false, message: "A book with the same title already exists" });
        }
        const existISBN = await BookModel.findOne({ ISBN: ISBN });
        if (existISBN) {
          return res.status(400).json({ status: false, message: "A book with the same ISBN already exists" });
        }

        const book = await BookModel.create(data);
        const createdBook = {
            _id: book._id,
            title: book.title,
            excerpt: book.excerpt,
            userId: book.userId,
            ISBN: book.ISBN,
            category: book.category,
            subcategory: book.subcategory,
            isDeleted: book.isDeleted,
            reviews: book.reviews,
            releasedAt: book.releasedAt.toISOString().split('T')[0]
        };

        return res.status(201).send({ status: true, message: "succesfully created", data: createdBook });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: false, message: 'An error occurred while creating the book' });
    }
}

const getAllBooks = async (req, res) => {
    try {
      const { userId, category,subcategory } = req.query;
      const filter = { isDeleted: false };
  
      if (userId) {
        filter.userId = userId;
      }
  
      if (category) {
        filter.category = category;
      }

      if(subcategory) {
        filter.subcategory = subcategory;
      }  
      const books = await BookModel.find(filter)
        .select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1,subcategory:1, releasedAt: 1, reviews: 1 })
        .sort({ title: 1 });
  
      if (books[0].length === 0) {
        return res.status(404).json({ status: false, message: "No books found" });
      }
  
      return res.status(200).json({ status: true, message: "Books list", data: books });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: error.message });
    }
  };
  

const getBookById = async (req, res) => {
    try {
      const { bookId } = req.params;
      const book = await BookModel.findOne({ _id: bookId });
  
      if (!book) {
        return res.status(404).json({ status: false, message: "Book not found" });
      }
  
      const reviewsData = await ReviewModel.find({ bookId: bookId });
  
      const bookDetails = {
        _id: book._id,
        title: book.title,
        excerpt: book.excerpt,
        userId: book.userId,
        category: book.category,
        subcategory: book.subcategory,
        isDeleted: book.isDeleted,
        reviews: reviewsData.length,
        releasedAt: book.releasedAt.toISOString().split('T')[0] ,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
        reviewsData: reviewsData
      };
  
      return res.status(200).json({ status: true, message: "Book details", data: bookDetails });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: "An error occurred while fetching the book" });
    }
  };
  
// const updateBookById = async function(req, res)  {
//     try {
//         const book = await BookModel.findOneAndUpdate({_id:req.params.bookId,isDeleted:false},{$set:{reviews:req.body.reviews}},{new:true});
//         return res.status(200).send({ status: true, message: "success", data: book });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({ status: false, message: 'An error occurred while updating book by id' });
//     }
// }

const updateBookById = async (req, res) => {
    try {
     
      const { bookId } = req.params;
      const { title, excerpt, releasedAt, ISBN } = req.body;
      if(bookId.trim().length!=24 || !(/^[0-9a-fA-F]+$/.test(bookId.trim())))
      {
       return res.status(400).json({status:false,message:"Invalid User ID"});
      }
  
      const existingBook = await BookModel.findOne({ _id: req.params.bookId, isDeleted: false });
  
      if (!existingBook) {
        return res.status(404).json({ status: false, message: "Book not found" });
      }

    // Check if another book already has the updated title
    const duplicateTitleBook = await BookModel.findOne({ title:title, isDeleted: false });

    if (duplicateTitleBook) {
      return res.status(400).json({ status: false, message: "Title already exists for another book" });
    }

    // Check if another book already has the updated ISBN
    const duplicateISBNBook = await BookModel.findOne({ ISBN:ISBN, isDeleted: false });

    if (duplicateISBNBook) {
      return res.status(400).json({ status: false, message: "ISBN already exists for another book" });
    }

      existingBook.title = title;
      existingBook.excerpt = excerpt;
      existingBook.releasedAt = releasedAt ;
      existingBook.ISBN = ISBN;
  
      const updatedBook = await BookModel.findOneAndUpdate({_id:req.params.bookId,isDeleted:false},{$set:{title,ISBN,releasedAt,excerpt}},{new:true},{upsert:true});
  
      return res.status(200).json({ status: true, message: "Book updated successfully", data: updatedBook });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: "An error occurred while updating the book" });
    }
  };
  
const deleteBookById = async function(req, res) {
    try {
        const book = await BookModel.findOneAndUpdate({_id:req.params.bookId,isDeleted:false},{$set:{isDeleted:true}},{new:true});
        return res.status(200).send({ status: true, message: "success", data: book });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: false, message: 'An error occurred while deleting book by id' });
    }
}
module.exports = {createBooks,getAllBooks,getBookById,updateBookById,deleteBookById};
