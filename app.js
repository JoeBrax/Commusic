document.getElementById('recommendButton').addEventListener('click', recommendAlbum);

function recommendAlbum() {
    const tripDuration = document.getElementById('tripDuration').value;
    if (!tripDuration) {
        alert('Please enter a trip duration.');
        return;
    }

    // Convert minutes to milliseconds
    const duration_ms = tripDuration * 60 * 1000;

    // Your Spotify API credentials
    const clientId = 'd9f308f2fb67450f98772f451f00b3aa';
    const clientSecret = '901bef727762426791b4ef16f1dc3cd1';

    // Use your own server (backend) to hide the client secret in production
    // For demonstration purposes, you can use the client credentials flow directly in the frontend
    // Be aware that exposing the client secret in the frontend is a security risk.
    const tokenEndpoint = 'https://accounts.spotify.com/api/token';
    const apiEndpoint = 'https://api.spotify.com/v1';

    // Obtain a Spotify access token using the client credentials flow
    fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials'
    })
    .then(response => response.json())
    .then(data => {
        const accessToken = data.access_token;

        // Search for albums with a duration close to the trip duration
        fetch(apiEndpoint + `/search?q=album%20duration:${duration_ms}&type=album&limit=1`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
        .then(response => response.json())
        .then(data => {
            const album = data.albums.items[0];
            if (album) {
                document.getElementById('albumRecommendation').textContent = `Recommended Album: ${album.name} by ${album.artists[0].name}`;
            } else {
                document.getElementById('albumRecommendation').textContent = 'No matching album found.';
            }
        })
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
}
