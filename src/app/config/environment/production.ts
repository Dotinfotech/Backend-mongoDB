'use strict';

// Production specific configuration
// =================================
module.exports = {
   // Server IP
   ip: process.env.OPENSHIFT_NODEJS_IP ||
           process.env.IP ||
           "0.0.0.0",
   // Server port
   port: process.env.OPENSHIFT_NODEJS_PORT ||
           process.env.PORT ||
           3016,
   seedDB: true,
   // MongoDB connection options
   mongo: {
      uri: 'mongodb://now:samcom84@162.250.121.171:27777/now'

   }
};