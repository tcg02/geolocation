const mongoose = require('mongoose')

const Locations = mongoose.model('Locations',{
    zip:{
        type:Number
    },    
    location:{
        index: '2dsphere',        
        type: [Number]
    },
    city:{
        type: String
    },
    state_id:{
        type: String
    },
    state_name:{
        type:String
    },
    county_fips:{
        type:Number
    },
    county_name:{
        type: String
    },
    timezone:{
        type: String
    }


})

module.exports = Locations