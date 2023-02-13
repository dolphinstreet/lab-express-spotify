require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:


app.get("/", (request, response) => {
    try {
        response.render("home")
    } catch (error) {
        console.log(error)
    }
})

app.get("/artist-search", (request, response) => {
    spotifyApi
        .searchArtists(request.query.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items);
            // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            const allArtists = data.body.artists.items
            response.render('artist-search-results', { allArtists })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums/:artistId', (request, response, next) => {
    let id = request.params.artistId;
    spotifyApi
        .getArtistAlbums(id)
        .then(data => {
            //response.send(data)
            const allAlbums = data.body.items
            response.render('album', { allAlbums })
        })
        .catch(err => console.log('An error occurred while displaying albums : ', err));

});

app.get('/tracks/:trackId', (request, response, next) => {
    let id = request.params.trackId;
    console.log(id)
    spotifyApi
        .getAlbumTracks(id)
        .then(data => {
            //response.send(data.body)
            const allTracks = data.body.items
            response.render('tracks', { allTracks })
        })
        .catch(err => console.log('An error occurred while displaying the tracks : ', err));

});



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
