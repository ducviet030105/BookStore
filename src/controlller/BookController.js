import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";

export const createBook = async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;

    if (!title || !caption || !rating || !image) {
      return res.status(400).json({
        message: "Please provide all fields",
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(image);

    const imageUrl = uploadResponse.secure_url;

    const newBook = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });

    await newBook.save();

    return res.status(201).json(newBook);
  } catch (error) {
    console.log("Error in createBook:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getAllBook = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 2;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");
    const totalBooks = await Book.countDocuments();
    res.send({
      books,
      currenPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    })
  } catch (error) {
    console.log("Error in register route", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(400).json({ message: "Book not found" });
    if (book.user.toString() !== book.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" })
    }
    if (book.image && book.image.includes('cloudinary')) {
      try {
        const publicId = book.image.split('/').pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.log("Error deleting image from cloudinary", deleteError);
      }
    }
    await book.deleteOne();
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log("Error in register route", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export const getUserBook = async (req, res) => {
  try {

    const books = await Book.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });
    return res.status(200).json(books);
  } catch (error) {
    console.error("GET USER BOOK ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};