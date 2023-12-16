const mongoose =require ('mongoose');
const cors = require('cors');
const express = require('express');
const Data = require('./models/data');
const Zone=require('./models/zone');
const Sensor=require('./models/sensor');
const MONGODB_URI =
  'mongodb+srv://coe558:kfupm@coe558.9j0xsua.mongodb.net/?retryWrites=true&w=majority';

const app = express();
app.use(cors());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB database!');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
app.get('/getdata', async (req, res) => {
    Data.find({}).then(function (data) {
        res.json(data);
    }).catch(function (err) {
        res.json(err);
    })
})
app.get('/getzone', async (req, res) => {
    Zone.find({})
    .then(data => res.json(data))
    .catch(err => res.json(err))
})

app.post("/data", async (req, res) => {
    try{
    const data=new Data({value:req.body.value,sensorId:req.body.sensorId})
    await data.save();
    res.status(201).json(data);
}catch(err){
    res.status(400).json({ message: err.message });
}})

app.post("/zone", async (req, res) => {
    try{
    const zoneId = req.body.zoneId;
    const zoneName = req.body.zoneName;
    const newZone = new Zone({ zoneId:zoneId, zoneName:zoneName });
    await newZone.save();
    // res it added 
    res.send(`zone ${newZone.zoneId} successfully  created`);
    }catch(err){
        res.status(400).json({ message: err.message });
    }
})

app.post("/sensor", async (req, res) => {
    try{ const sensorId = req.body.sensorId;
        const zoneId = req.body.zoneId;
        const sensorType = req.body.sensorType;
        const sensorName=req.body.sensorName;
        const newSensor = new Sensor({sensorId:sensorId,zoneId:zoneId,sensorType:sensorType,sensorName:sensorName });
        await newSensor.save();
        res.send(`Sensor ${newSensor.sensorId} successfully  created`)

    }catch(err){
        res.status(400).json({ message: err.message });}
   
})
app.get('/getzones', async (req, res) => {
    try{
    const data = await Zone.find({})
    res.send({status:"yes",data:data})
   }catch(err){
    res.status(400).json({ message: err.message });
   }
})

app.get('/getsensors', async (req, res) => {
    Sensor.find({}).then(function (data) {
        res.json(data);
    }).catch(function (err) {
        res.json(err);
    })
})
// find specific sensor by id
app.post("/getsensor",async (req,res) =>{
    const sensorId=req.body.sensorId;
    Sensor.findOne({sensorId:sensorId}).then(function (data) {
        res.json(data);
    }).catch(function (err) {
        res.json(err);
    })
})

app.post("/getzone",async (req,res) =>{
    try{
        const zoneId=req.body.zoneId;
        const zone=await Zone.findOne({zoneId:zoneId});
        if(!zone){
            throw new Error('Zone not found');
        }
        res.json(zone);

    }catch(err){
        res.status(400).json({ message: err.message });
    } 
})

// get data by timestamp to timestamp
app.post("/getdatabytime",async (req,res) =>{
    try{
        const from=req.body.from;
        const to=req.body.to;
        const data=await Data.find({timestamp:{$gte:from,$lte:to}});
        res.json(data);

    }catch(err){
        res.status(400).json({ message: err.message });
    } 
})

app.post("/getdatabyzone",async (req,res) =>{
    try{
        const zoneId=req.body.zoneId;
        const data=await Data.find({zoneId:zoneId});
        res.json(data);

    }catch(err){
        res.status(400).json({ message: err.message });
    } 
})

app.post("/getdatabysensor",async (req,res) =>{
    try{
        const sensorId=req.body.sensorId;
        const data=await Data.find({sensorId:sensorId});
        res.json(data);

    }catch(err){
        res.status(400).json({ message: err.message });
    } 
})

app.post("/getdatabytype",async (req,res) =>{
    try{
        const sensorType=req.body.sensorType;
        const data=await Data.find({sensorType:sensorType});
        res.json(data);

    }catch(err){
        res.status(400).json({ message: err.message });
    } 
})
// get sensor data by id using get

app.get('/getsensordata/:id', async (req, res) => {
    try {
        const sensorId = req.params.id;
        const data = await Data.find({sensorId:sensorId});
        if (!data) {
            throw new Error('data not found');
        }
        res.json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})
app.listen(5000, () => {
    console.log("Server is running on port 5000");
})
