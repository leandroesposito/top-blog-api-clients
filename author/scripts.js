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
  const posts = await apiService.getUserPosts(authService.userId);
  console.log(posts);
  posts.forEach((post) => {
    renderPost(post);
  });
}

function renderPost(post) {
  const postsContainer = document.querySelector(".posts");
  const newPost = document.createElement("div");
  newPost.classList.add("post");

  const title = document.createElement("div", {});
  title.classList.add("post-title");
  title.textContent = post.title;
  newPost.appendChild(title);

  const content = document.createElement("div", {});
  content.classList.add("post-content");
  content.textContent = post.content;
  newPost.appendChild(content);

  const date = document.createElement("div", {});
  date.classList.add("post-date");
  date.textContent = post.date;
  newPost.appendChild(date);

  const comments = document.createElement("div", {});
  comments.classList.add("post-comments");
  newPost.appendChild(comments);

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
