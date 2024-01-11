import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { readFileSync, writeFileSync,renameSync} from 'node:fs';
import uuid4 from 'uuid4';
import session from 'express-session';
import { request } from 'node:http';
import multer from 'multer';
import { log } from 'node:console';

const app = express();
const PORT = process.env.port || 8000;
const server = app.listen(PORT, () => {
    console.log(`SERVER running on Port ${PORT}`);
})


app.set('trust proxy', 1) // trust first proxy
app.use(session({ secret: 'abcdef', resave: false, saveUninitialized: true, cookie: { secure: false } }));


//check ob eingeloggt...
app.use( '/backend', (req,res,next)=>{
    // ist user eingeloggt...
    if (req.session.user) {
        next();
    } else {
        res.status(401).send('bitte zuerst einloggen');
    }
});

//ausloggen
app.get('/logout', (req, res) => {
    delete req.session.user;
    res.redirect("/login.html");
})


app.use(express.static('www'));
app.use(cors());
app.use(helmet());

app.use( express.urlencoded({extended:false})); // POST

const ADMIN_DATA_PATH = './data/admin.json'
const KATEGORIE_DATA_PATH = './data/kategorien.json'
const SPEISEN_DATA_PATH = './data/speisen.json'
const NACHRICHTEN_DATA_PATH = './data/nachrichten.json'
const UPLOAD_FOLDER_PATH = './www/uploads'

//login zu admin-Seite
app.post('/login', (req, res) => {
    console.log(req.body);
    let loginUser = req.body;
    let admins = JSON.parse(readFileSync(ADMIN_DATA_PATH))
    const checkUser = admins.find(el => el.username == loginUser.username && el.password == loginUser.password);
    if (checkUser) {
        req.session.user = loginUser.username
        res.status(201).send('')
    } else {
        res.status(401).send('')
    }
})
     
//Kategorie
app.get('/kategorie/alle', (req, res) => {
    const kategorien = JSON.parse(readFileSync(KATEGORIE_DATA_PATH));
    res.json(kategorien);
})

let neuID = '';
app.post('/kategorie/neukategorie', (req, res) => {
    const kategorien = JSON.parse(readFileSync(KATEGORIE_DATA_PATH));
    neuID = uuid4()
    const neukategorie = { id: neuID, ...req.body};
    console.log(req.body);
    console.log(neukategorie);
    kategorien.push(neukategorie);
    if (neukategorie.name == '') {
        res.status(204).send()
    } else {
    writeFileSync(KATEGORIE_DATA_PATH, JSON.stringify(kategorien));
        res.status(200).json(kategorien);
        } 
})

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, UPLOAD_FOLDER_PATH);
        },
        filename: function (req, file, cb) {
            const { fieldname, originalname, mimetype } = file
            const after = originalname.split('.')[1]
            console.log(neuID + '.' + after)
            cb(null, neuID +'.'+ after)
        }
    })
})

app.post('/kategorie/neukategorie/image', upload.single('image'), (req, res) => {
    console.log(req.file);
    console.log(neuID);
    const after = req.file.originalname.split('.')[1]
    let kategorien = JSON.parse(readFileSync(KATEGORIE_DATA_PATH));
    kategorien = kategorien.map(el => {
        if (el.id == neuID) { return { ...el, url: neuID + '.' + after }; } else { return el; }
    })
        writeFileSync(KATEGORIE_DATA_PATH, JSON.stringify(kategorien));
    res.send(req.file)
   
})




app.delete('/kategorie/:id', (req, res) => {
    const { id } = req.params;
    console.log('delete:'+id);
    const kategorien = JSON.parse(readFileSync(KATEGORIE_DATA_PATH));
    const filteredKategorien = kategorien.filter(kategorie => kategorie.id !== id)
    console.log("result",filteredKategorien);
    writeFileSync(KATEGORIE_DATA_PATH, JSON.stringify(filteredKategorien));
    res.status(200).send(filteredKategorien)
   
})
  


//Speisen
app.get('/speisen/alle', (req, res) => {
    const speisen = JSON.parse(readFileSync(SPEISEN_DATA_PATH));
    res.json(speisen);
})


app.post('/speisen/neuspeise', (req, res) => {
    const speisen = JSON.parse(readFileSync(SPEISEN_DATA_PATH));
    neuID = uuid4()
    const neuspeise = { menuid:neuID, ...req.body }
    console.log(neuspeise);
    speisen.push(neuspeise);
    writeFileSync(SPEISEN_DATA_PATH, JSON.stringify(speisen));
    res.status(200).json(speisen)
})
    
app.post('/kategorie/neuespeise/image', upload.single('image'), (req, res) => {
    const after = req.file.originalname.split('.')[1]
    let speisen = JSON.parse(readFileSync(SPEISEN_DATA_PATH));
    speisen = speisen.map(el => {
        if (el.menuid == neuID) { return { ...el, url: neuID + '.' + after }; } else { return el; }
    })
    writeFileSync(SPEISEN_DATA_PATH, JSON.stringify(speisen));   
    res.send(req.file)
   
})


app.delete('/speisen/:id', (req, res) => {
    const { id } = req.params;
    console.log(id);
    const speisen = JSON.parse(readFileSync(SPEISEN_DATA_PATH));
    const filteredSpeisen = speisen.filter(speise => speise.menuid !== id)
    console.log("result",filteredSpeisen);
    writeFileSync(SPEISEN_DATA_PATH, JSON.stringify(filteredSpeisen));
    res.send({ "speisen": filteredSpeisen })
})

//Nachrichten
app.get('/nachrichten/alle', (req,res) => {
    const nachrichten = JSON.parse(readFileSync(NACHRICHTEN_DATA_PATH));
    res.json(nachrichten)
})

app.post('/nachrichten/neunachrichte', (req, res) => {
    const nachrichten = JSON.parse(readFileSync(NACHRICHTEN_DATA_PATH));
    neuID = uuid4()
    const date = new Date();
    let time = date.getDate()
    const neuNachrichte = { id:neuID,...req.body };
    console.log(neuNachrichte);

    nachrichten.push(neuNachrichte);
    writeFileSync(NACHRICHTEN_DATA_PATH,JSON.stringify(nachrichten))
    res.json(nachrichten)
})

app.get('/nachrichten/:id', (req, res) => {
    const nachrichten = JSON.parse(readFileSync(NACHRICHTEN_DATA_PATH));
    const { id } = req.params;
    const chosenNachrichte = nachrichten.filter(nachrichte => nachrichte.id == id);
    console.log(chosenNachrichte);
    res.status(200).send(chosenNachrichte)

})

app.delete('/nachrichten/:id', (req, res) => {
    const { id } = req.params;
    console.log(id);
    const nachrichten = JSON.parse(readFileSync(NACHRICHTEN_DATA_PATH));
    const filteredNachrichten = nachrichten.filter(nachrichte => nachrichte.id !== id)
    console.log("result", filteredNachrichten);
    writeFileSync(NACHRICHTEN_DATA_PATH, JSON.stringify( filteredNachrichten ));
    res.send({ "nachrichten": filteredNachrichten })
})

//filter function
app.post('/filter', (req, res) => {
    const speisen = JSON.parse(readFileSync(SPEISEN_DATA_PATH));
    const filterValue = req.body;
    console.log(filterValue);
    if (filterValue.empfehlung == "false") {
        if (filterValue.scharf == "alles") {
            res.status(200).json(speisen)
        } else {
            const filteredSpeisen = speisen.filter(speise => speise.Scharf == filterValue.scharf)
            console.log(filteredSpeisen);
            res.status(200).json(filteredSpeisen);
        }
    } else {
        if (filterValue.scharf == "alles") {
            const filteredSpeisen = speisen.filter(speise => speise.Stern == "true")
            res.status(200).json(filteredSpeisen)
        } else {
            const filteredSpeisen = speisen.filter(speise => speise.Scharf == filterValue.scharf && speise.Stern=="true")
            console.log(filteredSpeisen);
            res.status(200).json(filteredSpeisen);
        }
    }
})


//search function
let found = [];

app.post('/search', (req, res) => {
    const speisen = JSON.parse(readFileSync(SPEISEN_DATA_PATH));
    const keyword = req.body.keyword;
    console.log(keyword);
    const found = speisen.filter(el => el.Speisenname.includes(keyword) == true || el.Zutaten.includes(keyword));
    console.log(found);
    res.status(200).json(found)
})
