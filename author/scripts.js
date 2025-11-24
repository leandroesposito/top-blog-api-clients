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

async function init() {
  if (!authService.isLogedIn()) {
    return (window.location.href = "./log-in.html");
  }
  setCurrentUser();

  const logOutButton = document.querySelector(".log-out-button");
  logOutButton.addEventListener("click", handleLogOut);

  await loadPosts();
}

init();
