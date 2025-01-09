
const area = document.getElementById('cadastro')
const commentArea = document.getElementById("comment")
const idSection = localStorage.getItem('id')
const nameSection = localStorage.getItem('name')
const emailSection = localStorage.getItem('email')
createPost()




if (area.style !== 'none') {
    document.querySelector('#formPost').addEventListener('submit', async (event) => {
        event.preventDefault()
        const values = await receivesvaluesInFormPost()
        const response = await makePost(values)
        if (!response.response.ok) {
            console.log('erro')
            return
        }
        console.log(response.data)
        document.querySelector('#formPost').submit()

    })
}


async function receivesvaluesInFormPost() {
    return {
        titulo: document.getElementById("titulo").value,
        conteudo: document.getElementById("conteudo").value,
        data_postagem: document.getElementById("data").value,
        id_user: userDataString = idSection
    }
}


async function makePost(object) {
    const response = await fetch('https://connect-people-api.onrender.com/posts/setPost', {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(object)
    })
    const data = await response.json()
    return {
        response,
        data
    }
}

console.log(receivesvaluesInFormPost())


function addFlexForm() {

    area.style.display = 'flex'
}

function removeFlexForm() {
    area.style.display = 'none'
}


async function getPost() {
    const response = await fetch('https://connect-people-api.onrender.com/posts')
    const data = await response.json()
    return data
}

async function getUser(id) {
    const response = await fetch(`https://connect-people-api.onrender.com/users/${id}`)
    const data = await response.json()
    return data[0]

}


async function createPost() {
    const postArea = document.getElementById('posts')
    const posts = await getPost()
    // const user = await getUser(id)


    const postsByDate = posts.sort((a, b) => new Date(b.data_postagem) - new Date(a.data_postagem))



    postsByDate.forEach(async post => {
        console.log(post.data_postagem)
        const divPost = document.createElement('div')
        const user = await getUser(Number(post.id_user))
        divPost.innerHTML = `
            <img src="/public/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector-removebg-preview.png" alt="" width="40px">
            <h3> ${user.name}<h3>
            <h1>${post.titulo}</h1>
            <p>${post.conteudo}</p>
            <h4>${post.data_postagem}</h4>
            <div class="coment-area" style="padding: 20px; margin-left: -25px">
                <button onclick="comment(${post.id})">Comentar</button>
            </div>
            <span> Seja o primeiro a comentar! </span>
              `
        divPost.className = 'post'
        const response = await fetch('https://connect-people-api.onrender.com/coments/' + post.id)
        const dataComments = await response.json()
        console.log(dataComments)
        if (dataComments.length > 0) {
            if (dataComments.length === 1) {
                divPost.querySelector('span').innerHTML = `${dataComments.length} comentario`
            }
            else {
                divPost.querySelector('span').innerHTML = `${dataComments.length} comentarios`
            }

            dataComments.forEach(c => {
                const commentDiv = document.createElement('div')
                commentDiv.innerHTML = `
                <img src="/public/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector-removebg-preview.png" alt="" width="30px" style="margin-bottom: -10px; 
                margin-top: 10px; margin-left: -5px">
                 <h3> ${c.user_name}<h3>
                 <p>${c.comentario}</p>
                  
                `
                if (c.id_user === Number(idSection)) {
                    const divDeleteComment = document.createElement('div')
                    divDeleteComment.innerHTML = `
                    <button onclick="deleteComment(${c.id})" style="margin-top: 20px; background-color: red; ">Exluir</button>
                    <button onclick="receivesComentForPut(${c.id}, ${post.id})" style="margin-top: 20px; margin-left: 0px">editar</button>
                    `
                    divDeleteComment.className = 'coment-area'

                   commentDiv.appendChild(divDeleteComment)
                }
                commentDiv.className = 'comment'
                divPost.appendChild(commentDiv)
            })

        }


        postArea.appendChild(divPost)
    })


}

function viewSideBar() {
    const divBar = document.getElementById("menu_lateral_button")

    if (divBar.style.display === 'flex') {
        divBar.style.display = 'none'
    }

    else {
        divBar.style.display = 'flex'
    }

}

async function comment(idPost) {
    commentArea.style.display = 'flex'

    document.querySelector('#commentForm').addEventListener('submit', async (event) => {
        event.preventDefault()
        const response = await makeComment(idPost)
        if (!response.response.ok) {
            console.log('erro')
            return
        }
        console.log(response.data)
        document.querySelector('#commentForm').submit()

    })



}
 
async function receivesComentForPut(id, id_post) {
    commentArea.style.display = 'flex'

    document.querySelector('#commentForm').addEventListener('submit', async (event) => {
        event.preventDefault()
        const response = await editComment(id, id_post)
        if (!response.response.ok) {
            console.log('erro')
            return
        }
        console.log(response.data)
        document.querySelector('#commentForm').submit()

    })
}

async function makeComment(idPost) {
    const response = await fetch('https://connect-people-api.onrender.com/coments/insertComent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            comentario: document.getElementById('comentario').value,
            id_post: idPost,
            id_user: idSection,
            user_name: nameSection.replaceAll(/[\\"]/g, '')
        })
    })

    const data = await response.json()

    return {
        response,
        data
    }
}

async function deleteComment(id) {
    const response = await fetch('https://connect-people-api.onrender.com/coments/deleteComent/' + id, {
        method: "DELETE",
        headers: {
            'Content-Type': "application/json"
        }
    })
    const data = await response.json()
    console.log(data)
    window.location.reload()
    return data
}

async function editComment(id, idPost) {
    const response = await fetch('https://connect-people-api.onrender.com/coments/updateComent/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            comentario: document.getElementById('comentario').value,
            id_post: idPost,
            id_user: idSection,
            user_name: nameSection.replaceAll(/[\\"]/g, '')
        })
    })

    const data = await response.json()

    return {
        data,
        response
    }

 
}

function removeFlexCommentArea() {
    commentArea.style.display = 'none'
}