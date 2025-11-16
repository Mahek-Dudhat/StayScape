const axios = require('axios');

async function geocode(address) {
    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: address,
                format: "json",
                limit: 1
            },
            headers: {
                'User-Agent': 'YourAirbnbClone/1.0' // Required by Nominatim
            }
        });


        if (response.data && response.data.length > 0) {
            return {
                latitude: parseFloat(response.data[0].lat),
                longitude: parseFloat(response.data[0].lon)
            };
        }

        console.log("Response: ", response.data[0]);
    } catch (err) {
        console.error("Geocoding error: ", err.message);
        return null;
    }
}

module.exports = { geocode };