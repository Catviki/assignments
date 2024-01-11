let table = document.querySelector('table')
let addNeuBtn = '';

let username = sessionStorage.getItem("user")
document.querySelector("#admin-name").innerHTML = username;

//Show alle Kategorien
document.querySelector('#kategorien').addEventListener('click', (e) => {
    
    e.preventDefault();
    addNeuBtn = 'neueKateBtn';
    showAlleKategorien();   
})

const showAlleKategorien = () => {
    document.querySelector('.title').innerHTML = 'Kategorien';
    document.querySelector('#addBtn').innerHTML = '';
    document.querySelector('#Brief').innerHTML = '';
    fetch('http://localhost:8000/kategorie/alle')
    .then(res => {return res.json()})
    .then(data => {
        console.log(data);  
      
        let th = 
        `
        <tr>
        <th>Kategorien</th>
        <th>Imagebild</th>
        <th class="delete">löschen</th>
        </tr>
        `
        table.innerHTML = th;

        let tr='';
        data.forEach(el => {
            tr += `
            <tr>
                <td>${el.name}</td>
                <td class="kategorie-Bild" id=${el.id}><img src="../uploads/${el.url}"></td>
                <td ><button class ="delete" id="${el.id}">löschen</button></td>
            </tr>
            `
        });
        table.innerHTML += tr;
        const neueKateBtn = '<button id = "neueKateBtn" >+neue Kategorie hinzufügen</button>' 
        document.querySelector('#addBtn').innerHTML += neueKateBtn
        deleteKategorie()
    })
}

//add new Kategorie
const submitNeuKategorien = () => {
    document.querySelector('#table').innerHTML = '';
    document.querySelector('.title').innerHTML = 'neue Kategorie hinzufügen';
    document.querySelector('#addBtn').innerHTML = '';
    document.querySelector('#table').innerHTML = `
        <label for="Kategoriename">Kategorie:</label>
        <input type="text" id="Kategoriename"><br><br>
        <input id="image-Kategorie" type="file" name="image">
        <button type="submit" id="submit">Submit</button><br><br>
        `;
      
    document.querySelector('#submit').addEventListener('click', (e) => {
        e.preventDefault();
     
        const newKategorie = document.querySelector('#Kategoriename').value;
        fetch('http://localhost:8000/kategorie/neukategorie', {
        method: 'post',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:`name=${newKategorie}`
        })
        .then(response => {
        console.log(response.status);
            if (response.status === 204) {
                console.log('Sie müssen eine Kategorie eingeben ')
            }
            else if (response.status === 200) {
                uploadKategorieImg();
                console.log('neue Kategorie wurde erfolgreich hinzugefügt');
                // showAlleKategorien()
            }
        })
    })
}

//delete eine Kategorie
const deleteKategorie = () => {
        const removeBtn = document.querySelectorAll('.delete')
          removeBtn.forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault()
                const deleteID = el.id;
                console.log(deleteID);
                fetch(`http://localhost:8000/kategorie/${el.id}`, {
                    method: 'delete'
                })
                    .then(response => {
                        if (response.status === 200) {
                        page = 'start';
                         showAlleKategorien()
                        }
                })
            })
        })
    
}

//Show alle Speisen
document.querySelector('#speisen').addEventListener('click', (e) => {
    e.preventDefault();
    addNeuBtn = 'neueSpeiseBtn';
    showAlleSpeisen()
})

const showAlleSpeisen = () => {
    document.querySelector('.title').innerHTML = 'Speisen';
    document.querySelector('#addBtn').innerHTML = '';
     document.querySelector('#Brief').innerHTML = '';

    fetch('http://localhost:8000/speisen/alle')
    .then(res => {return res.json()})
    .then(data => {
        console.log(data);  
        let th = 
        `
        <tr>
        <th class="spalte1">Speisenname</th>
        <th>Bild</th>
        <th>Zutaten</th>
        <th>Scharf</th>
        <th>Preis</th>
        <th>Stern</th>
        <th class="delete">löschen</th>
        </tr>
        `
        table.innerHTML = th;

        let tr='';
        data.forEach(el => {
            tr += `
            <tr>
                <td>${el.Speisenname}</td>
                <td class="speise-Bild" id=${el.id}><img src="../uploads/${el.url}"></td>
                <td>${el.Zutaten}</td>
                <td>${el.Scharf}</td>
                <td>${el.Preis}</td>
                <td>${el.Stern}</td>
                <td ><button class ="delete-Speise" id="${el.menuid}">löschen</button></td>
            </tr>
            `
        });
        table.innerHTML += tr;
        const neueSpeiseBtn = '<button id = "neueSpeiseBtn" >+neue Speise hinzufügen</button>' 
        document.querySelector('#addBtn').innerHTML += neueSpeiseBtn
        deleteSpeise()
    })
}

const submitNeueSpeisen = () => {
    document.querySelector('#table').innerHTML = '';
    document.querySelector('.title').innerHTML = 'neue Speisen hinzufügen';
    document.querySelector('#addBtn').innerHTML = '';
    document.querySelector('#table').innerHTML = `
        <label for="Speisenname">Speise:</label>
        <input type="text" id="Speisenname"><br><br>
        <label for="Gruppe">Gruppe:</label>
      
        <select name ="Gruppe" id="Gruppe">
            <option value="Bowl">Bowl</option>
            <option value="Burger">Burger</option>
            <option value="Nudeln">Nudeln</option>
        </select><br><br>

        <label for="Stern">Stern:</label>
        <select name ="Stern" id="Stern">
            <option value="true">Ja</option>
            <option value="false">Nein</option>
        </select><br><br>

        <label for="Scharf">Scharf:</label>
        <select name ="Scharf" id="Scharf">
            <option value="nicht scharf">nicht scharf</option>
            <option value="ein bisschen scharf">ein bisschen scharf </option>
            <option value="Sehr Scharf">sehr Scharf</option>
        </select><br><br>

        <label for="Preis">Preis:</label>
        <input type="text" id="Preis">Euro<br><br>

        <input id="image-Speise" type="file" name="image"><br><br>

        <label for="Zutaten">Zutaten:</label>
        <input type="text" id="Zutaten">Euro<br><br>

         <button type="submit" id="submit-Speise">Submit</button><br><br>
        `;
      
   
    document.querySelector('#submit-Speise').addEventListener('click', (e) => {
        e.preventDefault();
        uploadSpeiseImg();
        const newSpeise = document.querySelector('#Speisenname').value;
        const Gruppe = document.querySelector('#Gruppe').value;
        const Stern = document.querySelector('#Stern').value;
        const Scharf = document.querySelector('#Scharf').value;
        const Preis = document.querySelector('#Preis').value;
        const Zutaten = document.querySelector('#Zutaten').value;


        fetch('http://localhost:8000/speisen/neuspeise', {
        method: 'post',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:`Speisenname=${newSpeise}&Gruppe=${Gruppe}&Stern=${Stern}&Scharf=${Scharf}&Preis=${Preis}&Zutaten=${Zutaten}`
        })
        .then(response => {
        console.log(response.status);
            if (response.status === 204) {
                console.log('Sie müssen eine Kategorie eingeben ')
            }
            else if (response.status === 200) {
                console.log('neue Kategorie wurde erfolgreich hinzugefügt');
                showAlleSpeisen()
            }
        })
    })
}

const deleteSpeise = () => {
        const removeBtn = document.querySelectorAll('.delete-Speise')
         removeBtn.forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault()
                const deleteID = el.id;
                console.log(deleteID);
                fetch(`http://localhost:8000/speisen/${el.id}`, {
                    method: 'delete'
                })
                    .then(response => {
                        if (response.status === 200) {
                        showAlleSpeisen()
                        }
                })
            })
        })
    
}

//Show alle Nachrichten
document.querySelector('#nachrichten').addEventListener('click', (e) => {
    e.preventDefault();
    addNeuBtn = 'neueNachrichteBtn';
    showAlleNachrichten()
})

const showAlleNachrichten = () => {
    document.querySelector('.title').innerHTML = 'Nachrichten';
    document.querySelector('#addBtn').innerHTML = '';
    document.querySelector('#Brief').innerHTML = '';
    fetch('http://localhost:8000/nachrichten/alle')
    .then(res => {return res.json()})
    .then(data => {
        console.log(data);  
        let th = 
        `
        <tr>
            <th>Betreff</th>
            <th>von</th>
            <th>email</th>
            <th>Zeit</th>
            <th>Status</th>
            <th>löschen</th>
        </tr>
        `
        table.innerHTML = th;

        let tr='';
        data.forEach(el => {
            tr += `
            <tr>
                <td class="Betreff" id="${el.id}">${el.Betreff}</td>
                <td>${el.von}</td>
                <td>${el.email}</td>
                <td>${el.Zeit}</td>
                <td>${el.status}</td>
                <td><button class ="delete-Nachrichte" id="${el.id}">löschen</button></td>
            </tr>
            `
        });

        table.innerHTML += tr;
        nachrichtenLesen();
        deleteNachrichte();
    })
}

const nachrichtenLesen = () => {
    const nachrichten = document.querySelectorAll('.Betreff');
    nachrichten.forEach(el => {
        el.addEventListener('click', () => {
            console.log(el);
            console.log(el.id);
            fetch(`http://localhost:8000/nachrichten/${el.id}`)
                .then(res => { return res.json() })
                .then(data => {
                    console.log(data);
                    console.log(data[0].Betreff);
                    table.innerHTML = "";
                    let nachrichte = `
                    <h3>${data[0].Betreff}</h3>
                    <h5>Von ${data[0].von} am ${data[0].zeit}</h5><br><br>
                    <p>${data[0].Text}</p>
                    `
                    document.querySelector('#Brief').innerHTML+=nachrichte
                })

        })
    })
}

const deleteNachrichte = () => {
    const removeBtn = document.querySelectorAll('.delete-Nachrichte')
          removeBtn.forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault()
                const deleteID = el.id;
                console.log(deleteID);
                fetch(`http://localhost:8000/nachrichten/${el.id}`, {
                    method: 'delete'
                })
                    .then(response => {
                        if (response.status === 200) {
                        showAlleNachrichten()
                        }
                })
            })
        })
}

const uploadKategorieImg = async () => {
        const body = new FormData()
        const file = document.querySelector('#image-Kategorie').files[0]
        if (file) {
            body.append('image', file)
            const response = await fetch('http://localhost:8000/kategorie/neukategorie/image', {
                method: 'post',
                body
            })
            showAlleKategorien()
            console.log(response.file)
        } else {
            alert('bitte wählen Sie ein Bild aus')
        }
}
  
const uploadSpeiseImg = async () => {
        const body = new FormData()
        const file = document.querySelector('#image-Speise').files[0]
        if (file) {
            body.append('image', file)
            const response = await fetch('http://localhost:8000/kategorie/neuespeise/image', {
                method: 'post',
                body
            })
            console.log(response.file)
        } else {
            alert('bitte wählen Sie ein Bild aus')
        }
}

document.querySelector('#addBtn').addEventListener('click', (e) => {
    e.preventDefault();
    if (addNeuBtn == 'neueKateBtn') {
        submitNeuKategorien()
    }
    else if (addNeuBtn == 'neueSpeiseBtn') {
        submitNeueSpeisen()
    }
    else if (addNeuBtn == 'neueNachrichteBtn') {
        
    }
})