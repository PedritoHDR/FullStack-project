const express = require('express');
const exphbs = require('express-handlebars');
const expressFileUpload = require('express-fileupload');

const { postUser } = require('./js/services/db.service');
const app = express();

const port = 8080;
const serverUrl = `http://localhost:${port}`;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/public'));
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

app.get('/listener/v1/home', (req, res) => {
    res.render('Home');
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