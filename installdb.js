const DBNAME = "uszips"




const fs = require('fs');
const mongoose = require('mongoose');
const JSONStream = require('JSONStream');
const Location = require('./src/models/Locations');
 

mongoose.connect(`mongodb://127.0.0.1:27017/${DBNAME}`, {
    poolSize: 25,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false    
});
mongoose.Promise = global.Promise;

const db = mongoose.connection;
let arrayOfLocations = [];

db.on('open', () => {
  console.log('Connected to mongo server.\n');
  process.stdout.write('Processing.');
  const dataStreamFromFile = fs.createReadStream(`${__dirname}/dbDump/uszips.min.json`);
  dataStreamFromFile.pipe(JSONStream.parse('*')).on('data', async (LocationData) => {
    arrayOfLocations.push(LocationData);
    if (arrayOfLocations.length === 1000) {
      dataStreamFromFile.pause();
      await Location.insertMany(arrayOfLocations);
      arrayOfLocations = [];
      process.stdout.write('.');
      dataStreamFromFile.resume();
    }
  });

  dataStreamFromFile.on('end', async () => {
    await Location.insertMany(arrayOfLocations); // left over data
    console.log('\nImport complete, closing connection...');
    db.close();
    process.exit(0);
  });
});

db.on('error', (err) => {
  console.error('MongoDB connection error: ', err);
  process.exit(-1);
});