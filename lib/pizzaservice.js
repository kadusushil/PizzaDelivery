/**
 * This service is responsible for following things
 * - Returns Pizza menu for the user
 * Other operations are not possible with this service
 **/

 const _data = require('./data');

 var pizzaService = {};

 pizzaService.menu = {};

 pizzaService._menu = {};

 pizzaService.handleRequest = (data, callback) => {
   var possibleMethods = ['get'];

   if (possibleMethods.indexOf(data.method) > -1) {
     pizzaService._menu[data.method](data, callback);
   } else {
     callback(400, {'error':'this operation is not permitted'});
   }
 };

 /**
  * This method returns the Pizza for user.
  * No token or login is required to view the menu
  **/
 pizzaService._menu.get = (data, callback) => {
   _data.readFile('menu', 'menu', (error, data) => {
     if (!error && data) {
       callback(200, data);
     } else {
       callback(400, {'error':'Could not retrieve the menu items'});
     }
   });
 };

 module.exports = pizzaService;
