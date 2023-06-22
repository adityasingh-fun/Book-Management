const ReviewModel = require('../models/reviewModel');
const BookModel = require('../models/bookModel');

const createReview = async function (req, res) {
    try {
        const { review, rating, reviewedBy, reviewedAt } = req.body;

        const book = await BookModel.findById({ _id: req.params.bookId, isDeleted: false });

        if (!book)
            return res.status(404).send({ status: true, message: "no books with such id present" });

        const data = {
            bookId: book._id,
            review: review,
            rating: rating,
            reviewedBy: reviewedBy,
            reviewedAt: reviewedAt
        }
        const createReview = await ReviewModel.create(data);

        const findReview = await ReviewModel
            .findOne(createReview)
            .select({ updatedAt: 0, createdAt: 0, __v: 0 })
            .populate("bookId");


        // increasing reviews by 1.
        await BookModel.findOneAndUpdate(
            { _id: book._id, isDeleted: false },
            { $inc: { reviews: 1 } }
        );

        return res.status(201).send({
            status: true,
            message: "Review Added successfully",
            data: findReview,
        });
        //res.status(201).send({status:true,message:"success",data:createReview});
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

const updateReviewById = async function (req, res) {
    try {

        const { review, rating, reviewedBy } = req.body;
        const book = await BookModel.findById({ _id: req.params.bookId, isDeleted: false });
        if (!book)
            return res.status(404).send({ status: true, message: "no books with such id present" });

        if (req.params.reviewId.trim().length != 24 || !(/^[0-9a-fA-F]+$/.test(reviewId.trim()))) {
            return res.status(400).json({ status: false, message: "Invalid review ID" });
        }
        //    const exreview = await ReviewModel.findOne({ _id: reviewId, isDeleted: false });
        const findReview = await ReviewModel
            .findOne({ _id: req.params.reviewId })
        if (!findReview) {
            return res.status(400).send({ status: true, message: " reviewId not registered" });
        }
        const data = {
            bookId: book._id,
            review: review,
            rating: rating,
            reviewedBy: reviewedBy,
            reviewedAt: reviewedAt
        }
        const updateReview = await ReviewModel.findByIdAndUpdate({ _id: req.params.reviewId, data, isDeleted: false }, { $set: { review: req.body.review, rating: req.body.rating, reviewdBy: req.body.reviewdBy, reviewedAt: req.body.reviewedAt } }, { new: true }).populate("bookId");

        return res.status(201).send({ status: true, message: "success", data: updateReview });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

const deleteReview = async function (req, res) {
    try {
        const book = await BookModel.findById({ _id: req.params.bookId, isDeleted: false });
        if (!book)
            return res.status(404).send({ status: true, message: "no books with such id present" });

        if (req.params.reviewId.trim().length != 24 || !(/^[0-9a-fA-F]+$/.test(reviewId.trim()))) {
            return res.status(400).json({ status: false, message: "Invalid review ID" });
        }
        const review = await ReviewModel.findById({ _id: req.params.reviewId, isDeleted: false });
        if (!review)
            return res.status(404).send({ status: true, message: "no review with such id present" });

        const deleteReview = await ReviewModel.findByIdAndUpdate({ _id: req.params.reviewId }, { $set: { isDeleted: true } }, { new: true });

        res.status(201).send({ status: true, message: "success", data: deleteReview });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

module.exports = { createReview, updateReviewById, deleteReview };