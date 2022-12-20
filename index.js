const express = require('express')        // express return function it self
const connectToMongo = require('./db');    
const cors = require('cors');


const app = express()
const port = process.env.PORT || 4099

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello from Beatzz');
});

app.use('/auth',require('./routes/auth'));
app.use('/song',require('./routes/song'));
app.use('/playlist',require('./routes/playlist'));

if(process.env.NODE_ENV === 'production'){    
    app.use(express.static('client/build'))  // set static folder 
    //returning frontend for any route other than api 
    app.get('*',(req,res)=>{     
        res.sendFile (path.resolve(__dirname,'client','build',         
                      'index.html' ));    
    });
}


app.listen(port, () => {
    console.log(`Chat app listening at http://localhost:${port}`)
})

connectToMongo();