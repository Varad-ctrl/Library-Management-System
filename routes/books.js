const express = require("express");
const { books } = require('../data/books.json')
const { users } = require('../data/users.json')

const router = express.Router();

/**
 * Route : /,
 * Method : get
 * Description : get list of all Books
 * Access : Public
 * Paratmeter : none
 */

router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: books
    })
})

module.exports = router

/**
 * Route : /:id
 * Method : get
 * Description : get Books by their ID
 * Access : Public
 * Paratmeter : id
 */

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const book = books.find((each) => each.id === id)

    if (!book) {
        res.status(404).json({
            success: false,
            message: `Book not found for id:${id}`
        })
    }
    res.status(200).json({
        success: true,
        data: book
    })
})

/**
 * Route : /
 * Method : post
 * Description : create/register a new Book
 * Access : Public
 * Paratmeter : None
 */

router.post('/', (req, res) => {
    // req.body should have the following field
    const { id, name, author, genre, price, publisher } = req.body;
    // check if all required fields are present
    if (!id || !name || !author || !genre || price == null || !publisher) {
        res.status(400).json({
            success: false,
            message: "Please provide all the required fields"
        })
    }

    // Check if user already exist
    const book = books.find((each) => each.id === id)
    if (book) {
        res.status(409).json({
            success: false,
            message: `Book already exists with id: ${id}`
        })
    }

    // If pass then create user and push into user array
    books.push({ id, name, author, genre, price, publisher })

    res.status(201).json({
        success: true,
        message: "User created successfully"
    })

})

/**
 * Route : /:id
 * Method : put
 * Description : Updating a book by thier ID
 * Access : Public
 * Paratmeter : id
 */

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    // if (!data || Object.keys(data).length === 0) {
    //     return res.status(400).json({
    //         success: false,
    //         message: "Please provide data up to date"
    //     })
    // }

    const book = books.find((each) => each.id === id)

    if (!book) {
        res.status(404).json({
            success: false,
            message: `Book not found for id:${id}`
        })
    }

    // Object.assign(user, data);
    // With Spread Operator

    const updateBook = books.map((each) => {
        if (each.id === id) {
            return {
                ...each,
                ...data,
            }
        }
        return each
    })

    res.status(200).json({
        success: true,
        data: updateBook,
        message: "Book Updated successfully"
    })

})

/**
 * Route : /:id
 * Method : Delete
 * Description : Deleting a book by thier ID
 * Access : Public
 * Paratmeter : id
 */

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const book = books.find((each) => each.id === id)

    if (!book) {
        res.status(404).json({
            success: false,
            message: `Book not found for id:${id}`
        })
    }

    // If book exist then filter it out from the books array

    const updateBook = books.filter((each) => each.id !== id)

    //  2nd method

    // const index = users.indexOf(user);
    // users.splice(index, 1)

    res.status(200).json({
        success: true,
        data: updateBook,
        message: "Book Updated successfully"
    })

})

/**
 * Route : /books/issued
 * Method : Get
 * Description : Get all issued Book
 * Access : Public
 * Paratmeter : None
 */

router.get('/issued/total', (req, res) => {
    const userWithIssuedBooks = users.filter((each) => {
        if (each.issuedBook) {
            return each
        }
    })

    const issuedBooks = []

    userWithIssuedBooks.forEach((each) => {

        const book = books.find((book) => book.id == each.issuedBook)


        if (book) {
            book.issuedBy = each.name;
            book.issuedDate = each.issuedDate;
            book.returnDate = each.returnDate;

            issuedBooks.push(book)
        }
    })

    if (issuedBooks.length === 0) {
        return res.status(200).json({
            success: false,
            message: "No Books issued yet"
        })
    }

    res.status(200).json({
        success: true,
        data: issuedBooks
    })
})