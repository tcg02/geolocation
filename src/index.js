const express = require('express')
require('./db/mongoose')

const Location = require('./models/Locations')

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())

app.get('/location/:lat/:lng', async (req,res)=>{
    try{
        const lat = req.params.lat  
        const lng = req.params.lng  

        if(!lat || !lng){
            res.status(400).send(e)
        }

        const location = await Location.find({
            "lat":lat,
            "lng":lng
        })

        if(!location){
            return res.status(404).send()
        }

        res.send(location)
    }catch(e){
        res.status(500).send(e)
    }
 
})


app.listen(port,()=>{
    console.log('Server is up on port ' + port)
})