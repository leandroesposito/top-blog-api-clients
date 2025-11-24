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

  response.forEach((post) => {
    renderPost(post);
  });
}

function renderPost(post) {
  const postsContainer = document.querySelector(".posts");
  const newPost = RenderService.createPostElem(post);

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

async function handlePostSubmit() {
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

async function init() {
  if (!authService.isLogedIn()) {
    return (window.location.href = "./log-in.html");
  }
  setCurrentUser();

  const logOutButton = document.querySelector(".log-out-button");
  logOutButton.addEventListener("click", handleLogOut);

  const newPostButton = document.querySelector(".new-post-button");
  newPostButton.addEventListener("click", handleNewPostButton);

  const submitPostButton = document.querySelector(".post-form button");
  submitPostButton.addEventListener("click", handlePostSubmit);

  await loadPosts();
}

init();
