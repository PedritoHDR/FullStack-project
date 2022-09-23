const { postUser } = require("../services/db.service");

// const postUsers = async (req, res) => {
//     const { foto } = req.files;
//     const { name } = foto;
//     const { email, nombre, password, favorite_gender, favorite_song, birthday, country } = req.body
//     try {
//         await postUser(email, nombre, password, favorite_gender, favorite_song, birthday, country, name);
//         res.status(201);
//         res.redirect('/listener/v1/logIn');
//     } catch (e) {
//         res.status(500).json({
//         error: `Algo salió mal... ${e}`,
//         code: 500
//         });
//     };
//     foto.mv(`${__dirname}/public/uploads/${name}`, (err) => {
//         if(err) return res.status(500).json({
//             error: `Algo salió mal...${err}`,
//             code: 500
//         });
//         res.json('Foto cargada con éxito');
//     });
// };

module.exports = {
    postUsers
}