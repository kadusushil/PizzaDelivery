/**
 * This class is responsible for following things
 * - You can view your current cart
 * - You can add/update itmes to the cart
 * - You can delete items from the cart
 * You need to be logged in to perform operation on the cart
 **/

 const _data = require('./data');
 const authService = require('./authservice');

 var cart = {};

 cart._service = {};

 /**
  * Enter into the service through this method
  * Choose possible options
  **/
 cart.handleRequest = (data, callback) => {
   var possibleMethods = ['get', 'post', 'put', 'delete'];
   console.log('Inside handle request of cart');
   if (possibleMethods.indexOf(data.method) > -1) {
     console.log('Inside cart, selecting post method: ', data.method);
     cart._service[data.method](data, callback);
   } else {
     callback(400, {'error':'operation not supported'});
   }
 };

 /**
  * A user can view his current cart using this method
  * Required fields are marked with (*).
  * Headers
  * - token (*)

  * QueryString
  * - email (*)
  **/
 cart._service.get = (data, callback) => {
   var token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length == 20
               ? data.headers.token : false;

   var email = typeof(data.queryString.email) == 'string' && data.queryString.email.trim().length > 0
               ? data.queryString.email.trim() : false;

   if (token && email) {
     // verify the token
     authService.authService(token, (isTokenValid) => {
       if (isTokenValid) {
         _data.readFile('cart', email, (error, cartData) => {
           if (!error) {
             callback(200, cartData);
           } else {
             callback(200, {});
           }
         });
       } else {
         callback(401, {'error':'Token is expired'});
       }
     });
   } else {
     callback(400, {'error':'missing required fields, please pass valid token in headers and email of the user is query'});
   }
 };

 /**
  * Deletes the item from cart
  * Fields marked with (*) are mandatory
  * Headers
  * - token (*)
  *
  * QueryString
  * - email (*)
  *
  * Body (optional)
  * - [{'id':pizza_id}]
  *
  * If body is empty then entire cart in emptied other specific items are deleted.
  **/
 cart._service.delete = (data, callback) => {
   const email = typeof(data.queryString.email) == 'string' && data.queryString.email.trim().length > 0
                 ? data.queryString.email.trim() : false;
   const token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length == 20
                 ? data.headers.token.trim() : false;

   const cartDetails = typeof(data.payload) == 'object' ? data.payload : false;

   if (email && token) {
     authService.verifyToken(token, (isTokenValid) => {
       if (isTokenValid) {
         if (!cartDetails) {
           _data.deleteFile('cart', email, (error) => {
             if (!error) {
               callback(200);
             } else {
               callback(400, {'error':'Could not delete the cart'});
             }
           });
         } else {
           // TODO when body is passed
         }
       } else {
         callback(401, {'error':'Not a valid token'});
       }
     });
   } else {
     callback(400, {'error':'missing required fields.'});
   }
 };

 /**
  * Adds item to the cart
  * Fields marked with (*) are mandatory
  * Headers
  * - token
  *
  * QueryString
  * - email
  *
  * Payload (payload in following format)
  * - [{"id":111111, "quantity":2}, {"id":444444, "quantity":1}]
  *
  **/
 cart._service.post = (data, callback) => {
   const email = typeof(data.queryString.email) == 'string' && data.queryString.email.trim().length > 0
                 ? data.queryString.email.trim() : false;
   const token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length == 20
                 ? data.headers.token.trim() : false;

   const cartDetails = typeof(data.payload) == 'object' && data.payload.length > 0 ? data.payload : false;

   if (email && token) {
     authService.verifyToken(token, (isTokenValid) => {
       if (isTokenValid) {
         if (cartDetails) {

           // callback(200);
           // see if existing cart has any details
           _data.readFile('cart', email, (error, data) => {
             if (!error && data) {

               // if it has data
               cartDetails.forEach((item) => {
                 const itemId = item.id;
                 var found = false;
                 console.log('item: ', item);
                 data.forEach((cartItem) => {
                   console.log('cartItem: ', cartItem);
                   if (itemId == cartItem.id) {
                     // add up the quantity
                     cartItem.quantity = item.quantity + cartItem.quantity;
                     found = true;
                   }
                 });
                 console.log('Found: ', found);
                 if (!found) {
                   data.push(item)
                 }
               });
               console.log('cart Details: ', data);
               // write it to file and
               _data.updateFile('cart', email, data, (error) => {
                 if (!error) {
                   callback(200);
                 } else {
                   callback(400, {'error':'couldn\'t update the cart'});
                 }
               });
             } else {
               // cart is empty
               console.log('The cart to be filled up: ', cartDetails);
               _data.createFile('cart', email, cartDetails, (error) => {
                 if (!error) {
                   callback(200);
                 } else {
                   callback(400, {'error':'Could not add items to cart'});
                 }
               });
             }
           });
         } else {
           callback(400, {'error':'Nothing to add to cart'});
         }
       } else {
         callback(401, {'error':'Not a valid token'});
       }
     });
   } else {
     callback(400, {'error':'missing required fields.'});
   }
 };


 module.exports = cart;
