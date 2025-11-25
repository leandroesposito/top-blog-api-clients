function setCurrentUser() {
  const currentUserContainer = document.querySelector(".current-user");
  currentUserContainer.textContent = authService.username;
}

function handleLogOut() {
  localStorage.removeItem("username");
  localStorage.removeItem("userId");
  localStorage.removeItem("token");
  window.location.reload();
}

async function loadPosts() {
  console.log("fetching posts...");
  RenderService.showLoading();
  const response = await ApiService.getUserPosts(authService.userId, true);
  RenderService.hideLoading();

  if (response.errors) {
    RenderService.displayErrors(response.errors);
    return;
  }

  response.posts.forEach((post) => {
    renderPost(post);
  });
}

function renderPost(post) {
  const postsContainer = document.querySelector(".posts");
  const newPost = RenderService.createPostElem(post);

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("buttons");

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.dataset.id = post.id;
  editButton.addEventListener("click", handleEditPostClick);
  buttonsContainer.appendChild(editButton);

  const deletePostButton = document.createElement("button");
  deletePostButton.textContent = "Delete";
  deletePostButton.dataset.id = post.id;
  deletePostButton.addEventListener("click", handleDeletePostClick);
  buttonsContainer.appendChild(deletePostButton);

  newPost.appendChild(buttonsContainer);

  const comments = newPost.querySelectorAll(".comment");
  if (comments) {
    [...comments].forEach((comment, index) => {
      const deleteCommentButton = document.createElement("button");
      deleteCommentButton.textContent = "Delete";
      deleteCommentButton.dataset.id = post.comments[index].id;
      deleteCommentButton.addEventListener("click", handleDeleteComentClick);
      comment.appendChild(deleteCommentButton);
    });
  }

  postsContainer.appendChild(newPost);
}

function resetPostForm() {
  const postForm = document.querySelector(".post-form");
  const idInput = postForm.querySelector("[name='id']");

  postForm.reset();
  idInput.value = "";
}

function handleNewPostButton() {
  resetPostForm();
  const postFormContainer = document.querySelector(".post-form-container");
  const titleInput = postFormContainer.querySelector("[name='title']");
  const formTitle = postFormContainer.querySelector("h3");
  formTitle.textContent = "New Post";

  postFormContainer.classList.remove("hidden");
  titleInput.focus();
}

function hidePostForm() {
  resetPostForm();
  const postFormContainer = document.querySelector(".post-form-container");
  postFormContainer.classList.add("hidden");
}

async function handlePostSubmit(event) {
  event.preventDefault();
  const postForm = document.querySelector(".post-form");
  const formData = new FormData(postForm);

  const post = {
    title: formData.get("title"),
    content: formData.get("content"),
    "is-published": !!formData.get("is-published"),
    id: formData.get("id"),
  };

  let result;

  RenderService.showLoading();
  if (post.id === "") {
    result = await ApiService.createPost(post);
  } else {
    alert("NOT IMPLEMENTED");
  }
  RenderService.hideLoading();

  if (result.errors) {
    RenderService.displayErrors(result.errors);
  }
  if (result.success) {
    RenderService.displaySuccess(result.success);
    hidePostForm();
  }

  if (result.post) {
    renderPost(result.post);
  }
}

function handleCancelPostForm() {
  hidePostForm();
}

async function handleDeletePostClick(event) {
  const target = event.target;
  const id = target.dataset.id;

  const result = await ApiService.deletePost(id);

  if (result.errors) {
    RenderService.displayErrors(result.errors);
  }
  if (result.success) {
    RenderService.displaySuccess(result.success);
    const postElement = document.querySelector(
      `.post:has(button[data-id='${id}'])`
    );
    postElement.remove();
  }
}

function handleEditPostClick() {
  alert("Not implemented");
}

function handleDeleteComentClick() {
  alert("Not implemented");
}

async function init() {
  if (!authService.isLogedIn()) {
    return (window.location.href = "./log-in.html");
  }
  setCurrentUser();

  const logOutButton = document.querySelector(".log-out-button");
  logOutButton.addEventListener("click", handleLogOut);

  const newPostButton = document.querySelector(".new-post-button");
  newPostButton.addEventListener("click", handleNewPostButton);

  const postForm = document.querySelector(".post-form");
  postForm.addEventListener("submit", handlePostSubmit);

  const cancelPostFormButton = postForm.querySelector("button.cancel");
  cancelPostFormButton.addEventListener("click", handleCancelPostForm);

  await loadPosts();
}

init();
