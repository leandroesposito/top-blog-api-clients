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

function clearPostForm() {
  const postForm = document.querySelector(".post-form");

  postForm.reset();

  const idInput = postForm.querySelector("[name='id']");
  idInput.value = "";
}

function showPostForm(formTitle) {
  const postFormContainer = document.querySelector(".post-form-container");
  const titleInput = postFormContainer.querySelector("input#title");

  const formTitleElement = postFormContainer.querySelector("h3");
  formTitleElement.textContent = formTitle;

  postFormContainer.classList.remove("hidden");
  titleInput.focus();
}

function handleNewPostButton() {
  showPostForm("New post");
}

function hidePostForm() {
  clearPostForm();
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
    result = await ApiService.editPost(post);
    if (result.success) {
      const updatedPostElement = document.querySelector(
        `.post:has(button[data-id='${post.id}'])`
      );
      updatedPostElement.remove();
    }
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

async function handleEditPostClick(event) {
  const target = event.target;
  const id = target.dataset.id;

  const result = await ApiService.getPostById(id);

  if (result.errors) {
    RenderService.displayErrors(result.errors);
  }
  console.log(result);
  if (result.post) {
    const postForm = document.querySelector(".post-form");

    postForm.elements["title"].value = result.post.title;
    postForm.elements["content"].value = result.post.content;
    postForm.elements["is-published"].checked = result.post.isPublished;
    postForm.elements["id"].value = result.post.id;

    showPostForm("Edit post");
  }
}

async function handleDeleteComentClick(event) {
  const target = event.target;
  const id = target.dataset.id;

  const response = await ApiService.deleteComment(id);

  if (response.errors) {
    RenderService.displayErrors(response.errors);
  }
  if (response.success) {
    RenderService.displaySuccess(response.success);
    const commentElement = document.querySelector(
      `.comment:has(button[data-id='${id}'])`
    );
    commentElement.remove();
  }
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
