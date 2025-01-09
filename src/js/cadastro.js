document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const values = await receivesValuesInForm()
    const response = await sendFormValues(values)
    if(!response.response.ok) {
       const p = document.querySelector('p')
       p.innerHTML = 'Esse email já está cadastrado'
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



async function receivesValuesInForm() {
    
    return{
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
}

async function sendFormValues(object) {
    const response = await fetch('https://connect-people-api.onrender.com/users/insert', {
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