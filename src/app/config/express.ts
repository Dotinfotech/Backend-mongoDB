/**
 * Express configuration
 */

'use strict';

import * as express from 'express';
import * as morgan from 'morgan';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';
import * as cookieParser from 'cookie-parser';
import * as errorHandler from 'errorhandler';
import * as path from 'path';
import { default as config } from './environment';
import * as passport from 'passport';
import * as session from 'express-session';
import * as mongoS from 'connect-mongo';
let mongoStore = mongoS(session);
import * as mongoose from 'mongoose';

module.exports = function (app) {
   var env = app.get('env');

   app.use(compression());
   app.use(bodyParser.urlencoded({extended: false}));
   app.use(bodyParser.json({inflate: true}));
   app.use(methodOverride());
   app.use(cookieParser());
   app.use(passport.initialize());

   // Persist sessions with mongoStore
   // We need to enable sessions for passport twitter because its an oauth 1.0 strategy
   app.use(session({
      secret: config.secrets.session,
      resave: true,
      saveUninitialized: true,
      store: new mongoStore({
         mongooseConnection: mongoose.connection,
         db: 'dotwhitelable'
      })
   }));

   if ('production' === env) {
      app.use(morgan('dev'));
   }

   if ('development' === env || 'test' === env) {
      app.use(require('connect-livereload')());
      app.use(morgan('dev'));
      app.use(errorHandler()); // Error handler - has to be last
   }
};