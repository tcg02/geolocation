const express = require('express')
require('./db/mongoose')

const Location = require('./models/Locations')

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())

app.get('/location/', async (req,res)=>{    
    try{ 
        const lat = req.query.lat  
        const lng = req.query.lng    
        const zip = req.query.zip   
        
        
        if(!((lat && lng) || zip)){
            return res.status(400).send(e)
        }

        let foundlocation

        if(lat && lng){
            foundlocation = await Location.find({
                location:{
                    $near:{
                        $geometry:{
                            type: "Point",
                            coordinates: [lng, lat]
                        },                         
                        $maxDistance: 5000

                    }                    
                }
            })
        }
        
        if(zip){
            foundlocation = await Location.findOne({
                "zip":zip               
            })
        }

        if(!foundlocation){
            return res.status(404).send()
        }

        res.send(foundlocation)
    }catch(e){
        res.status(500).send(e)
    }
 
})


app.listen(port,()=>{
    console.log('Server is up on port ' + port)
})