/**
 * Responsible for maintaining order history. It will have following things.
 * - Update the order against the user
 * - Add order to order history folder
 * - GET orders provided valid token is passed
 **/

const _data = require('./data');
const helpers = require('./helpers');

var orderhistory = {};

orderhistory._history = {};

// local request routing
orderhistory.handleRequest = (data, callback) => {
  const possibleMethods = ['post'];

  if (possibleMethods.indexOf(data.method) > -1) {
    orderhistory._history[data.method](data, callback);
  } else {
    callback(400, {'erorr':'Operation not permitted'});
  }
};

/**
 * Returns the orders for a user.
 * Following are required fields
 * Headers
 * - token (*)
 *
 * Body
 * - email (*)
 * - order_id (optional)
 **/
orderhistory._history.post = (data, callback) => {

};

/**
 * This is responsible for generating order id and adding it to history.
 * Once the order id is generated, it updates the user to link order history.
 **/
orderhistory.addOrder = (email, orderData, callback) => {
  email = typeof(email) == 'string' && email.trim().length > 0
                ? email : false;
  orderData = typeof(orderData) == 'object' ? orderData : false;

  if (email && orderData) {
    const orderId = helpers.generateRandomId(10);
    if (orderId) {
      var order = {
        'order_id' : orderId,
        'details' : orderData
      };

      _data.createFile('history', orderId, order, (error) => {
        if (!error) {
          // udpate user object to referece this
          _data.readFile('users', email, (error, userData) => {
            if (!error && userData) {
              var orderHistory = typeof(userData.orders) == 'object' &&
                                      userData.orders.length > 0
                                      ? userData.orders : [];

              orderHistory.push(orderId);
              userData.orders = orderHistory;

              _data.updateFile('users', email, userData, (error) => {
                if (!error) {
                  callback({'order_id':orderId});
                } else {
                  callback(false);
                }
              });
            } else {
              callback(false);
            }
          });
        } else {
          callback(false);
        }
      });
    } else {
      callback(false);
    }
  } else {
    callback(false);
  }
}

module.exports = orderhistory;
