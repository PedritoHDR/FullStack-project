const express = require('express');
const exphbs = require('express-handlebars');
const expressFileUpload = require('express-fileupload');
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const dotenv = require('dotenv');
const {
    postUser
} = require('./js/services/db.service');

dotenv.config();
const app = express();
const port = 8080;
const serverUrl = `http://localhost:${port}`;
const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.env.CLIENT_SECRET; // Your secret
const redirect_uri = 'http://localhost:8080/listener/v1/callback'; // Your redirect uri
let generateRandomString = (length) => {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
const stateKey = 'spotify_auth_state';


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/public'));
app.use(cors())
app.use(cookieParser());
app.use(
    expressFileUpload({
        limits: 5000000,
        abortOnLimit: true,
        responseOnLimit: 'El tamaño de la imagen supera el límite permitido'
    })
);
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.engine(
    'handlebars',
    exphbs.engine({
        defaultLayout: "main",
        layoutsDir: `${__dirname}/views/mainLayout`,
        partialsDir: `${__dirname}/views/components`,
    })
);
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/listener/v1/signIn', (req, res) => {
    res.render('SignIn');
});

app.post('/listener/v1/users', async (req, res) => {
    const {
        foto
    } = req.files;
    const {
        name
    } = foto;
    const {
        email,
        nombre,
        password,
        favorite_gender,
        favorite_song,
        birthday,
        country
    } = req.body
    try {
        await postUser(email, nombre, password, favorite_gender, favorite_song, birthday, country, name);
        res.status(201);
        res.render('SignIn');
    } catch (e) {
        res.status(500).json({
            error: `Algo salió mal... ${e}`,
            code: 500
        });
    };
    foto.mv(`${__dirname}/public/uploads/${name}`, (err) => {
        if (err) return res.status(500).json({
            error: `Algo salió mal...${err}`,
            code: 500
        });
        res.status(201);
    });
});

app.get('/listener/v1/logIn', (req, res) => {
    res.render('LogIn');
});

app.get('/listener/v1/loginSpotify', (req, res) => {

    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    const scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

app.get('/listener/v1/callback', (req, res) => {

    // your application requests refresh and access tokens
    // after checking the state parameter

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer.alloc(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {

                var access_token = body.access_token,
                    refresh_token = body.refresh_token;

                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(options, function (error, response, body) {
                    console.log(body.email);
                });

                // we can also pass the token to the browser to make requests from there
                res.redirect('/listener/v1/home?' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
});

app.get('/listener/v1/refresh_token', (req, res) => {

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer.alloc(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});

app.get('/listener/v1/home', async (req, res) => {
    try {
        const { access_token } = req.query;
        const { email } = req.body;
        res.render('Home');
    } catch (error) {
        
    }
});

app.get('/listener/v1/playlists', (req, res) => {
    res.render('Playlists');
});

app.get('/listener/v1/userProfile', (req, res) => {
    res.render('UserProfile');
});

app.get('/listener/v1/userProfileInfo', (req, res) => {
        res.render('UserProfileInfo');
    }),

app.get('/listener/v1/friendInfo', (req, res) => {
    res.render('FriendInfo');
});

app.listen(port, console.log(`SERVER RUNNING ON ${serverUrl}`));