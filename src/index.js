let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

initialize()

function initialize() {
  fetch("http://localhost:3000/toys")
  .then(response => response.json())
  .then(data => {
    renderAllToys(data)
  })
}

function renderAllToys(toyData) {
  toyData.forEach(function (postToy) {
    renderToy(postToy)
  })
}

function renderToy (toy) {
  const outerDiv = document.createElement('div')
  const toyDiv = document.querySelector("#toy-collection")
  outerDiv.classList.add("card")
  outerDiv.dataset.id = toy.id
  outerDiv.innerHTML = 
                      `<h2>${toy.name}</h2>
                      <img src=${toy.image} class="toy-avatar" />
                      <p>${toy.likes} </p>
                      <button class="like-btn">Like</button>`
  toyDiv.appendChild(outerDiv)
}

const toyDiv = document.querySelector("#toy-collection")
toyDiv.addEventListener('click', function(e){
  const toyCard = e.target.closest("div.card") 
  const like = toyCard.querySelector("div.card p")
    if(e.target.matches(".like-btn")){
      likeCount = parseInt(like.textContent) + 1
      like.textContent = likeCount
      const id = toyCard.dataset.id
      fetch(`http://localhost:3000/toys/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        likes: likeCount     
        }),
      })
      .then(response => response.json())
      .then(updatedToy => {
        likeCount = updatedToy.likes
      })
    }
})

const toyForm = document.querySelector(".add-toy-form")
toyForm.addEventListener("submit", toySubmit)

function toySubmit(event) {
  event.preventDefault();
  const name = event.target.name.value
  const imgUrl = event.target.image.value
  const toyObj = {
    name: name,
    image: imgUrl,
    likes: 0
  }

  fetch('http://localhost:3000/toys', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(toyObj),
  })
  .then(response => response.json())
  .then(newToy => {
    renderToy(newToy)

  })

  event.target.reset()

}
