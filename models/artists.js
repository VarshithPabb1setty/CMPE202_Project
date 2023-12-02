const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema({
    // artistId: {
    //     type: String,
    // },
    artistName: { 
        type: String, 
        required: true 
    },
    dob: { 
        type: Date 
    },
    movies: [
        String
    ],
    location: { 
        type: String 
    },
    description: { 
        type: String 
    },
    roleType: { 
        type: String 
    },
    profileUrl: { 
        type: String 
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});

const ArtistModel = mongoose.model("Artist", artistSchema);

module.exports = ArtistModel;
