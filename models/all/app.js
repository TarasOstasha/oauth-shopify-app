import mongoose from 'mongoose';

// create a APP model
var App = mongoose.model('App', {
    name: { type: String, index: true, required: true, unique: true },
    hotel: {
        map: {
            coordinates: {
                x: Number,
                y: Number,
            }
        }
    },
    google_api_key: String,
    google_api_JSON: String,
    gmailSettings:{
        address: String,
        password: String,
    }
});

export default App;