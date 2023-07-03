const express = require('express');

const { check, body } = require('express-validator');

const User = require('../models/user');

const router  = express.Router();

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',
[
  body('email')
    .isEmail()
    .withMessage('Please enter valid E-mail')
    .normalizeEmail(),
  body('password')
    .isLength({min: 5})
    .withMessage('Please enter password with atleast 5 characters!')
    .trim(),
],
 authController.postLogin);

router.post('/signup',
 [
   check('email')
     .isEmail()
     .withMessage('Please enter valid E-mail')
     .normalizeEmail()
     .custom((value, {req}) => {
     return User.findOne({email: value}).then(userDoc => {
        if (userDoc) {
            return Promise.reject('E-mail already exists!');
        }
    });
 }),
 body('password')
 .isLength({min: 5})
 .withMessage('Please enter password with atleast 5 characters!')
 .trim(),
 body('confirmPassword').custom((value, {req}) => {
    if (value !== req.body.password) {
        throw new Error('Passwords must match!');
    }
    return true;
 }).trim()
], 
 authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);



module.exports = router;