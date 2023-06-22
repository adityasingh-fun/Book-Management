const express = require('express');
const router = express.Router();
const userContrlr = require('../controller/userController');
const BookContrl = require('../controller/bookController');
const ReviewCntrl = require('../controller/reviewController');
const Mid = require('../middlewares/authMiddleware');
const Validtn = require('../middlewares/validation');
//user api //done
router.post('/register', Validtn.userValidations,userContrlr.registerUser);
router.post('/login',userContrlr.login);

//book apis
router.post('/books', Mid.authenticationMid,Mid.authorizationMidd,Validtn.bookValidation,BookContrl.createBooks);//done
router.get('/books',Mid.authenticationMid,BookContrl.getAllBooks);
router.get('/books/:bookId',Mid.authenticationMid,BookContrl.getBookById);
router.put('/books/:bookId',Mid.authenticationMid,Mid.authorizationMid,BookContrl.updateBookById);
router.delete('/books/:bookId',Mid.authenticationMid,Mid.authorizationMid,BookContrl.deleteBookById);

//review apis
 router.post('/books/:bookId/review',Validtn.reviewValidation,ReviewCntrl.createReview);
 router.put('/books/:bookId/review/:reviewId',Validtn.reviewValidationUpdt,ReviewCntrl.updateReviewById);
 router.delete('/books/:bookId/review/:reviewId',Validtn.reviewValidation,
 ReviewCntrl.deleteReview);

module.exports = router;

