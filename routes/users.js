const express = require("express");
const { users } = require('../data/users.json')

const router = express.Router();
/**
 * Route : /users,
 * Method : get
 * Description : get list of all users
 * Access : Public
 * Paratmeter : none
 */

router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: users
    })
})

/**
 * Route : /users:id
 * Method : get
 * Description : get users by their ID
 * Access : Public
 * Paratmeter : id
 */

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id)

    if (!user) {
        res.status(404).json({
            success: false,
            message: `User not found for id:${id}`
        })
    }
    res.status(200).json({
        success: true,
        data: user
    })
})

/**
 * Route : /users
 * Method : post
 * Description : create/register a new user
 * Access : Public
 * Paratmeter : None
 */

router.post('/', (req, res) => {
    // req.body should have the following field
    const { id, name, surname, email, subscriptionType, subscriptionDate } = req.body;
    // check if all required fields are present
    if (!id || !name || !surname || !email || !subscriptionType || !subscriptionDate) {
        res.status(400).json({
            success: false,
            message: "Please provide all the required fields"
        })
    }

    // Check if user already exist
    const user = users.find((each) => each.id === id)
    if (user) {
        res.status(409).json({
            success: false,
            message: `User already exists with id: ${id}`
        })
    }

    // If pass then create user and push into user array
    users.push({ id, name, surname, email, subscriptionType, subscriptionDate })

    res.status(201).json({
        success: true,
        message: "User created successfully"
    })

})

/**
 * Route : /users/:id
 * Method : put
 * Description : Updating a user by thier ID
 * Access : Public
 * Paratmeter : None
 */

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    const user = users.find((each) => each.id === id)

    if (!user) {
        res.status(404).json({
            success: false,
            message: `User not found for id:${id}`
        })
    }

    // Object.assign(user, data);
    // With Spread Operator

    const updateUser = users.map((each) => {
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
        data: updateUser,
        message: "User Updated successfully"
    })

})

/**
 * Route : /users/:id
 * Method : Delete
 * Description : Deleting a user by thier ID
 * Access : Public
 * Paratmeter : id
 */

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const user = users.find((each) => each.id === id)

    if (!user) {
        res.status(404).json({
            success: false,
            message: `User not found for id:${id}`
        })
    }

    // If user exist then filter it out from the users array

    const updateUser = users.filter((each) => each.id !== id)

    //  2nd method

    // const index = users.indexOf(user);
    // users.splice(index, 1)

    res.status(200).json({
        success: true,
        data: updateUser,
        message: "User Updated successfully"
    })

})

// app.all('*', (req, res) => {
//     res.status(500).json({
//         message: "Not Build Yet"
//     })
// })

/**
 * Route : /subscription-details/:id
 * Method : Delete
 * Description : Get all subscription details by thier ID
 * Access : Public
 * Paratmeter : id
 */
router.get('/subscription-details/:id', (req, res) => {
    const { id } = req.params;

    const user = users.find((each) => each.id == id) // ✅ fix type

    if (!user) {
        return res.status(404).json({   // ✅ add return
            success: false,
            message: `User not found for id:${id}`
        })
    }

    const getDateInDays = (data = '') => {
        let date;
        if (data) {
            date = new Date(data);
        } else {
            date = new Date();
        }
        let days = Math.floor(date / (1000 * 60 * 60 * 24));
        return days;
    }

    const subscriptionType = (data) => {
        let date = data;   // ✅ fix undefined variable
        if (user.subscriptionType === "Basic") {
            date = date + 90;
        } else if (user.subscriptionType === "Standard") {
            date = date + 180;
        } else if (user.subscriptionType === "Premium") {
            date = date + 365;
        }
        return date;
    }

    // Subscription Expiration Calculation

    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate)

    const data = {
        ...user,
        subscriptionExpired: subscriptionExpiration < currentDate,
        subscriptionDaysLeft: subscriptionExpiration - currentDate,
        daysLeftForExpiration: returnDate - currentDate,
        returnDate: returnDate < currentDate ? "Book is overdue" : returnDate, // ✅ typo fix
        fine: returnDate < currentDate ? (subscriptionExpiration <= currentDate ? 200 : 100) : 0
    }

    res.status(200).json({
        success: true,
        data: data,
    })
})

module.exports = router;