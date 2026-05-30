
// Import required modules
const express = require('express');

// Create an Express application
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Temporary storage
let playlists = [];

// Home Page
app.get('/', (req, res) => {

    res.render('home', {
        playlists
    });

});

// Playlist Page
app.get('/playlist', (req, res) => {

    res.render('playlist', {
        playlists
    });

});

// Favourite Page
app.get('/favourite', (req, res) => {

    const favourites = playlists.filter(
        playlist => playlist.favourite
    );

    res.render('favourite', {
        favourites
    });

});

// Create Page
app.get('/create', (req, res) => {

    res.render('create');

});

// Create Playlist
app.post('/create', (req, res) => {

    const { name, artist } = req.body;

    const newPlaylist = {
        id: Date.now(),
        name,
        artist,
        playCount: 0,
        favourite: false
    };

    playlists.push(newPlaylist);

    res.redirect('/playlist');

});

// Listen to Playlist
app.post('/listen/:id', (req, res) => {

    playlists = playlists.map((playlist) => {

        if (playlist.id == req.params.id) {

            playlist.playCount++;

            // Auto favourite after 3 listens
            if (playlist.playCount >= 3) {

                playlist.favourite = true;

            }
        }

        return playlist;

    });

    res.redirect('/playlist');

});

// Add / Remove Favourite
app.post('/favourite/:id', (req, res) => {

    playlists = playlists.map((playlist) => {

        if (playlist.id == req.params.id) {

            playlist.favourite = !playlist.favourite;

        }

        return playlist;

    });

    res.redirect('/playlist');

});

// Delete Playlist
app.post('/delete/:id', (req, res) => {

    playlists = playlists.filter(
        playlist => playlist.id != req.params.id
    );

    res.redirect('/playlist');

});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server is running on http://localhost:${PORT}`);

});