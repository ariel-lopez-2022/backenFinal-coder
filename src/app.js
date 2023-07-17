//const {config} = require('dotenv')
const express = require('express');
const server = express();
const productsRouteBd = require('./routes/products.router')
const cartsRouteBd = require('./routes/carts.router')
const sessionRoute = require('./routes/session.route');
const paymentsRute = require('./routes/payments.router')
const  initPassaport  = require('./utils/passaport.config');
const passport = require('passport');
const cookieParse = require('cookie-parser');
const {PORT, MONGODBURL } = require('./config/config');
const mdwError = require('./utils/middleware/errors');
const {mdwLooger, logger} = require('./config/config.winston')
const loggerTest = require('./controller/logger.controller');
const { serve } = require('swagger-ui-express');
const { ui } = require('./utils/swaggerV1');
const cors = require('cors');


if (MONGODBURL) import('./config/config.db.js');

server.use(cors({
    origin:'http://127.0.0.1:5173',
    //origin:'http://localhost:5173',
    credentials:true,  
}))

server.listen(PORT || 3000,  () => 
 logger.debug(`🔥 Server started on port http://localhost:${PORT}`),
)


// passport 
initPassaport();
server.use(passport.initialize());
server.use(cookieParse())


//express
server.use(express.static(__dirname+'/public'));
server.use(express.json())
server.use(express.urlencoded({extended:true}))

 //middlewares

server.use(mdwError) // error
server.use(mdwLooger) //winston looger
server.use('/api-docs', serve, ui)

//rutas


server.use("/api/products/", productsRouteBd );
server.use("/api/carts/", cartsRouteBd );
server.use('/api/session', sessionRoute)
server.use('/loggerTest', loggerTest )
server.use('/api/payments', paymentsRute)

   

 





