document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const values = await receivesValuesInFormLogin()
    const response = await sendForm(values)
    console.log(response.data)
    if(!response.response.ok) {
       const p = document.querySelector('p')
       p.innerHTML = 'Email ou Senha estão incorretos'
       p.className = 'error'
       return
       
    }
    const userObject = {
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        password: response.data.password
    }

    

    await saveToStorage('id',  userObject.id)
    await saveToStorage('name',  userObject.name)
    await saveToStorage('email', userObject.email)
    document.querySelector('form').submit()
    

    

})


async function  ping() {
    const response = await fetch("https://connect-people-api.onrender.com/ping") 
    if(!response.ok) {
        console.log("Ainda estou me conectando")
    }

    console.log("estou conectado")
    
}



ping()

async function receivesValuesInFormLogin() {
    return {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    }
}

async function sendForm(object) {
    const response = await fetch('https://connect-people-api.onrender.com/users/access', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(object)
    })

    const data = await response.json()
    console.log(data)
    return {
        response,
        data
    }


}

async function saveToStorage(key, value) {
    const save = localStorage.setItem(key, JSON.stringify(value))
    return save
}