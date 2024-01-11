const renderMenu = () => {
    fetch('http://localhost:8000/speisen/alle')   
        .then(res => { return res.json() })
        .then(data => {
            let html = '';
            data.forEach(el => {
                let Scharf = showChili(el.Scharf)
                if (el.Stern == "true") {
                   html = `
                <div class="box">
                    <div class ="stern">&#9733;</div>
                    <div class="image"><img src="uploads/${el.url}"></div>
                    <div class="name">${el.Speisenname}</div>
                    <div class="zutaten"><div>${el.Zutaten}</div></div>
                    <div>${Scharf}</div>
                    <div class="line">________</div>
                    <div class="preis">${el.Preis} Euro</div>
            </div>
                ` 
                } else{
                html = `
                <div class="box">
                    <div class ="stern"> </div>
                    <div class="image"><img src="uploads/${el.url}"></div>
                    <div class="name">${el.Speisenname}</div>
                    <div class="zutaten"><div>${el.Zutaten}</div></div>
                    <div>${Scharf}</div>
                    <div class="line">________</div>
                <div class="preis">${el.Preis} Euro</div>
            </div>
                ` 
                    }

            document.querySelector('.menu-container').innerHTML+=html 
            });



        })
}
renderMenu()

document.querySelector('.menu-all').addEventListener('click', () => {
    document.querySelector('.menu-container').innerHTML = '';
    renderMenu()
})

const showGruppeMenu = () => {
     document.querySelectorAll('.menu-btn').forEach(btn => {
         btn.addEventListener('click', () => {
            document.querySelector('.menu-container').innerHTML = '';
            console.log(btn.innerHTML);
            const response = fetch('http://localhost:8000/speisen/alle')
                .then(res => { return res.json() })
                .then(data => { 
                    const menus = data.filter(data=>data.Gruppe == btn.innerHTML)
                    console.log(menus);
                    menus.forEach(el => {
                        let Scharf = showChili(el.Scharf)
                        if (el.Stern == "true") {
                        html = `
                        <div class="box">
                            <div class ="stern">&#9733;</div>
                            <div class="image"><img src="uploads/${el.url}"></div>
                            <div class="name">${el.Speisenname}</div>
                            <div class="zutaten"><div>${el.Zutaten}</div></div>
                            <div>${Scharf}</div>
                            <div class="line">________</div>
                            <div class="preis">${el.Preis} Euro</div>
                    </div>
                        ` 
                        } else{
                        html = `
                        <div class="box">
                            <div class ="stern"> </div>
                            <div class="image"><img src="uploads/${el.url}"></div>
                            <div class="name">${el.Speisenname}</div>
                            <div class="zutaten"><div>${el.Zutaten}</div></div>
                            <div>${Scharf}</div>
                            <div class="line">________</div>
                        <div class="preis">${el.Preis} Euro</div>
                    </div>
                        ` 
                    }

            document.querySelector('.menu-container').innerHTML+=html 
            });
                })
        })
    })
    
}
showGruppeMenu()

document.querySelector('#submit').addEventListener('click', (e) => {
    e.preventDefault();
    sendNachricht()
})

const sendNachricht = () =>{
    const sender = document.querySelector('#sender').value;
    const email = document.querySelector('#email').value;
    const betreff = document.querySelector('#betreff').value;
    const nachricht = document.querySelector('#nachricht').value;
    const ungelesen = "ungelesen"
    fetch('http://localhost:8000/nachrichten/neunachrichte', {
        method: 'post',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:`Betreff=${betreff}&von=${sender}&email=${email}&status=ungelesen&time=${Date.now()}&Zeit=${(new Date()).toLocaleString()}&Text=${nachricht}`
        }).then(response => {
            console.log(response.status);
                if (response.status === 204) {
                    console.log('geht nicht ')
                }
                else if (response.status === 200) {
                    uploadKategorieImg();
                    console.log('eingelangt');
                    
                }
            })
}

//filter 
const renderFilter = () => {
    document.querySelector('.menu-container').innerHTML = '';
    const scharf = document.querySelector('#scharf').value;
    const empfehlung = document.querySelector('#empfehlung').checked;
    console.log(scharf);
    console.log(empfehlung);
    fetch('http://localhost:8000/filter', {
        method: 'post',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:`scharf=${scharf}&empfehlung=${empfehlung}`
    })
    .then(res => {
        console.log(res.status);
            if (res.status === 200) {
                return res.json()
            }
            else if (res.status === 204) {
                console.log('nicht gefunden');
            }
    })
        .then(data => {
            console.log(data);
            data.forEach(el => {
                let Scharf = showChili(el.Scharf);
                if (el.Stern == "true") {
                   html = `
                <div class="box">
                    <div class ="stern">&#9733;</div>
                    <div class="image"><img src="uploads/${el.url}"></div>
                    <div class="name">${el.Speisenname}</div>
                    <div class="zutaten"><div>${el.Zutaten}</div></div>
                    <div>${Scharf}</div>
                    <div class="line">________</div>
                    <div class="preis">${el.Preis} Euro</div>
            </div>
                ` 
                } else{
                html = `
                <div class="box">
                    <div class ="stern"> </div>
                    <div class="image"><img src="uploads/${el.url}"></div>
                    <div class="name">${el.Speisenname}</div>
                    <div class="zutaten"><div>${el.Zutaten}</div></div>
                    <div>${Scharf}</div>
                    <div class="line">________</div>
                <div class="preis">${el.Preis} Euro</div>
            </div>
                ` 
                    }

            document.querySelector('.menu-container').innerHTML+=html 
            });
            
    })
}

document.querySelector('#scharf').addEventListener('change', renderFilter);
document.querySelector('#empfehlung').addEventListener('change', renderFilter);


//search
document.querySelector('#suchen-Btn').addEventListener('click',(e)=>{
    e.preventDefault();
    renderSearch();
})

const renderSearch = () => {
    document.querySelector('.menu-container').innerHTML = '';
    const keyword = document.querySelector('#suchen').value;
    fetch('http://localhost:8000/search', {
        method: 'post',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:`keyword=${keyword}`
    })
        .then(res => {
        return res.json()
        })
        .then(data => {
            console.log(data);
            
            data.forEach(el => {
                 const Scharf = showChili(el.Scharf)
                if (el.Stern == "true") {
                   html = `
                <div class="box">
                    <div class ="stern">&#9733;</div>
                    <div class="image"><img src="uploads/${el.url}"></div>
                    <div class="name">${el.Speisenname}</div>
                    <div class="zutaten"><div>${el.Zutaten}</div></div>
                    <div>${Scharf}</div>
                    <div class="line">_______________</div>
                    <div class="preis">${el.Preis} Euro</div>
            </div>
                ` 
                } else{
                html = `
                <div class="box">
                    <div class ="stern"> </div>
                    <div class="image"><img src="uploads/${el.url}"></div>
                    <div class="name">${el.Speisenname}</div>
                    <div class="zutaten"><div>${el.Zutaten}</div></div>
                    <div>${Scharf}</div>
                    <div class="line">________</div>
                <div class="preis">${el.Preis} Euro</div>
            </div>
                ` 
                    }

            document.querySelector('.menu-container').innerHTML+=html 
            });
    })
}

const showChili = (Scharf) => {
    let chiliIcon = '';
    if (Scharf == 'nicht scharf') {
        chiliIcon = '';
    } else if (Scharf == 'ein bisschen scharf') {
       chiliIcon = '<i class="fa-solid fa-pepper-hot"></i>'
    } else if (Scharf == 'sehr scharf') {
        chiliIcon = '<i class="fa-solid fa-pepper-hot"></i> <i class="fa-solid fa-pepper-hot"></i>'
    }
    return chiliIcon;
}


document.querySelector('.nav-btn').addEventListener('click', (e) => {
    e.preventDefault();
    const navList = document.querySelector('.navList')
    if (navList.className == "navList") {
        navList.className = "navList active"
    } else {
        navList.className = "navList"
    }
})