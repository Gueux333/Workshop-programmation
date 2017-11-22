// Récupération des librairies de base permettant de faire un serveur d'API
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import favicon from "serve-favicon";
import mongoose from "mongoose";
import exphbs from "express-handlebars";
import moment from "moment";

// Récupération du fichier de configuration qui dépend de l'environnement :
// - /config/dev.js si vous lancez l'application en local
// - /config/prod.js si vous lancez l'application sur votre serveur chez Heroku
import config from "./config";
import HandlebarsConfig from "./helpers/HandlebarsConfig";

// Récupération des controllers
import SeedDbController from "./controllers/SeedDbController";
import HomeController from "./controllers/HomeController";
import ShowController from "./controllers/ShowController";
import BookingController from "./controllers/BookingController";
import PlaceController from "./controllers/PlaceController";
import SeedDbControllerPlaces from "./controllers/SeedDbController";
import UserController from "./controllers/UserController";

// Configuration du serveur
const viewsPath = __dirname + '/views/';
const server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(favicon(path.resolve('./src/assets/favicon.png')));

server.use(express.static(path.resolve('./src/assets')));
server.set('views', path.resolve('./src/views'));
server.engine('.hbs', exphbs(HandlebarsConfig));
server.set('view engine', '.hbs');

server.set('port', (process.env.PORT || 5000));
server.listen(server.get('port'), () => {
  console.log('Node app is running on port', server.get('port'));
});

// CROSS : cela permettra plus tard d'accéder aux API produites ici depuis l'appli mobile
// Voir ici pour plus d'info : https://developer.mozilla.org/fr/docs/HTTP/Access_control_CORS
server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Connection à la base de donnée
mongoose.connect('mongodb://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@' + config.bddUri, {}, (err, res) => {
  if (err) {
    // La connection a échouée
    console.log('Mongo error:' + config.bddUri + '. ' + err);
  } else {
    // La connection a réussie
    console.log('Mongo success: ' + config.bddUri);
  }
});


// Routes pour initialiser la base
server.post('/seeddb', SeedDbController.seedDb);

server.post('/seeddb', SeedDbControllerPlaces.seedDb);

// Routes pour les vues
server.get('/', HomeController.getIndex);

server.get('/shows', ShowController.getShows);
server.get('/shows/id/:id', ShowController.getShow);
server.get('/shows/create', ShowController.getCreateShow);
server.post('/shows/create', ShowController.postCreateShow);
server.get('/shows/update/:id', ShowController.getUpdateShow);
server.post('/shows/update/:id', ShowController.postUpdateShow);
server.get('/shows/delete/:id', ShowController.getDeleteShow);

server.get('/users', UserController.getUsers);
server.get('/users/id/:id', UserController.getUser);
server.get('/users/update/:id', UserController.getUpdateUser);
server.post('/users/update/:id', UserController.postUpdateUser);


server.get('/places', PlaceController.getPlaces);
server.get('/places/id/:id', PlaceController.getPlace);
server.get('/places/create', PlaceController.getCreatePlace);
server.post('/places/create', PlaceController.postCreatePlace);
server.get('/places/update/:id', PlaceController.getUpdatePlace);
server.post('/places/update/:id', PlaceController.postUpdatePlace);
server.get('/places/delete/:id', PlaceController.getDeletePlace);

server.get('/bookings', BookingController.getBookings);
server.get('/bookings/id/:id', BookingController.getBooking);
server.get('/bookings/create', BookingController.getCreateBooking);
server.post('/bookings/create', BookingController.postCreateBooking);
server.get('/bookings/update/:id', BookingController.getUpdateBooking);
server.post('/bookings/update/:id', BookingController.postUpdateBooking);
server.get('/bookings/delete/:id', BookingController.getDeleteBooking);

// Routes pour les APIs
server.get('/api/', HomeController.getIndexApi);

server.get('/api/shows', ShowController.getShowsApi);
server.get('/api/shows/id/:id', ShowController.getShowApi);
server.post('/api/shows/create', ShowController.postCreateShowApi);
server.post('/api/shows/update/:id', ShowController.postUpdateShowApi);
server.post('/api/shows/delete/:id', ShowController.postDeleteShowApi);

server.get('/api/users', UserController.getUsersApi);
server.get('/api/users/id/:id', UserController.getUserApi);
server.post('/api/users/update/:id', UserController.postUpdateUserApi);


server.get('/api/places', PlaceController.getPlacesApi);
server.get('/api/places/id/:id', PlaceController.getPlaceApi);
server.post('/api/places/create', PlaceController.postCreatePlaceApi);
server.post('/api/places/update/:id', PlaceController.postUpdatePlaceApi);
server.post('/api/places/delete/:id', PlaceController.postDeletePlaceApi);

server.get('/api/bookings', BookingController.getBookingsApi);
server.get('/api/bookings/id/:id', BookingController.getBookingApi);
server.post('/api/bookings/create', BookingController.postCreateBookingApi);
server.post('/api/bookings/update/:id', BookingController.postUpdateBookingApi);
server.post('/api/bookings/delete/:id', BookingController.postDeleteBookingApi);
