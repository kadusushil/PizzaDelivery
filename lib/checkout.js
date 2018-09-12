/**
 * This file is responsible for handling the checkout process.
 * It accepts users request to checkout the items from cart.
 **/

const fs = require('fs');
const _data = require('./data');
const authService = require('./authservice');
const helpers = require('./helpers');
const orderHistory = require('./orderhistory');

var checkout = {};

checkout._check = {};

checkout.handleRequest = (data, callback) => {
  const possibleMethods = ['post'];

  if (possibleMethods.indexOf(data.method) > -1) {
    checkout._check[data.method](data, callback);
  } else {
    callback(400, {'error':'Operation not permitted'});
  }
};

/**
 * Method responsible for checking out users cart.
 * Following are the mandatory Fields
 * Header
 * - token
 *
 * QueryString
 * - email
 *
 * Body
 * - Card details for stripe
 **/
checkout._check.post = (data, callback) => {

  const email = typeof(data.queryString.email) == 'string' && data.queryString.email.trim().length > 0
                ? data.queryString.email.trim() : false;

  const token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length == 20
                ? data.headers.token.trim() : false;

  if (email && token) {
    authService.verifyToken(token, (isTokenValid) => {
      if (isTokenValid) {
        // check card details from user
        // TODO payment to be done

        _data.readFile('cart', email, (error, orderData) => {
          if (!error && orderData) {

            orderHistory.addOrder(email, orderData, (data) => {
              if (data) {
                // checkout and send email
                helpers.sendEmail(email, 'Pizza: Order confirmation',
                'This email is to confirm your order we received.', (error) => {
                  if (!error) {
                    console.log('Message has been sent successfully');
                    // once email is sent successfully
                    // empty the cart and send success back.
                    _data.deleteFile('cart', email, (error) => {
                      if (!error) {
                        callback(200, data);
                      } else {
                        callback(400, {'error':'Could not empty the cart'});
                      }
                    });
                  } else {
                    // we won't be making this order fail since payment is done
                    // ideally, we should have timer to try this job again
                    // after some time.
                    console.log('Error sending email: ', error);
                  }
                });
              } else {
                callback(400, {'error':'Error occurred'})
              }
            });
          } else {
            callback(400, {'error':'error checking out cart'});
          }
        });
      } else {
        callback(401, {'error':'Token expired, please try again later'});
      }
    });
  } else {
    callback(400, {'eror':'missing required fields'});
  }
};

module.exports = checkout;
