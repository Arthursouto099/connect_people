///posts/:id

const id = localStorage.getItem('id')
const nameSection = localStorage.getItem('name')
const emailSection = localStorage.getItem('email')
const area = document.getElementById('editar')




viewPostById()


async function viewPostById() {
    const response = await fetch('https://connect-people-api.onrender.com/posts/' + id)
    const data = await response.json()
    return data

}


async function makeProfileInfo() {
    const div = document.getElementById('profile')


    const profile = document.createElement('div')
    profile.innerHTML = `

     <div class="info">
     <img src="/public/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector-removebg-preview.png" alt="">
     <h1 class="name">${nameSection.replace(/[\\"]/g, '')}</h1>
     </div>
    
    `

    div.appendChild(profile)



}

makeProfileInfo()

async function createPost() {
    const postArea = document.getElementById('posts')
    const posts = await viewPostById()
    // const user = await getUser(id)
    if(posts.length < 1) {
        const divMessageEmpty = document.createElement('div')
        divMessageEmpty.innerHTML = `
        <p> Você ainda não fez nenhuma postagem </p>
        
        `
        postArea.className = 'empty_message'
        postArea.appendChild(divMessageEmpty)
    }



    posts.forEach(async post => {
        const divPost = document.createElement('div')
        divPost.innerHTML = `
             <div class="info info-post">
            <img src="/public/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector-removebg-preview.png" alt="" width="40px">
            <h1> ${nameSection.replace(/[\\"]/g, '')}</h1>
            </div>
            <h1>${post.titulo}</h1>
            <p>${post.conteudo}</p>
            <h4>${post.data_postagem}</h4>
            <div class="button-container">
            <button class="delete-button" onclick="deletePost(${await post.id})">Deletar</button>
            <button class="edit-button" onclick="addFlexForm(${await post.id})">Editar</button>
            </div>
              `
        divPost.className = 'post'
        
        postArea.appendChild(divPost)
      
     })
}

createPost()

async function deletePost(id) {
    const response = await fetch('https://connect-people-api.onrender.com/posts/deletePost/'+id, {
        method: "DELETE",
        headers: {
            'Content-Type': "application/json"
        }
    })
    const data = await response.json()
    const responseComment = await fetch('https://connect-people-api.onrender.com/coments/deleteAllComents/' + id, {
        method: "DELETE",
        headers: {
            'Content-Type': "application/json"
        }
    })
    const dataComent = response.json()
    window.location.reload()
    return data


}

async function editArea() {

}

async function formValues() {

    return  {
        
        titulo: document.getElementById('titulo').value,
        conteudo: document.getElementById('conteudo').value,
        data: document.getElementById('data').value
    }

    
}



async function  editPost(id, obj) {
    const response = await fetch(`https://connect-people-api.onrender.com/posts/editPost/${id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            titulo: await obj.titulo,
            conteudo: await obj.conteudo,
            data_postagem: await obj.data
        })
    })

    const data = await response.json()
    console.log(data)

    return {
        response,
        data
    }
}


function addFlexForm(id) {
    
    area.style.display = 'flex'

    
    document.querySelector('#formPost').addEventListener('submit', async (event) => {
        event.preventDefault()
        const values = await formValues()
        const response = await editPost(id, values)
        if(!response.response.ok) {
            console.log('erro')
            return
        }
        console.log(response.data)
        document.querySelector('form').submit()

    })


}




function removeFlexForm() {
    
    area.style.display = 'none'
}