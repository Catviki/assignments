const SERVER = 'http://localhost:8000'

    document.querySelector('#btn').addEventListener('click', (e) => {
        e.preventDefault();
        let username = document.querySelector('#username').value;
        let password = document.querySelector('#password').value;
        console.log(username + '/' + password);
        fetch(SERVER + '/login', {
            method: 'post',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body:`username=${username}&password=${password}`
        })
            .then(response => {
                if (response.status === 201) {
                    sessionStorage.setItem("user", username)
                    location.href = '/backend/admin.html'
                } else {
                    alert('login failed')
                }
        })
       
  })

    


