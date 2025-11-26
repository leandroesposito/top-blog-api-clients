async function loadPosts() {
  console.log("fetching posts...");
  RenderService.showLoading();
  const response = await ApiService.getAllPosts();
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

  const leaveCommentButton = document.createElement("button");
  leaveCommentButton.textContent = "Leave a comment";
  leaveCommentButton.dataset.id = post.id;
  leaveCommentButton.addEventListener("click", handleLeaveCommentClick);
  buttonsContainer.appendChild(leaveCommentButton);

  const newPostComments = newPost.querySelector(".comments");

  newPost.insertBefore(buttonsContainer, newPostComments);

  postsContainer.appendChild(newPost);
}

function handleLeaveCommentClick(event) {
  const target = event.target;
  const post = target.closest(".post");
  const postComments = post.querySelector(".comments");

  if (post.querySelector(".comment-form-container")) {
    return;
  }

  removeCommentForm();

  const newCommentForm = RenderService.createCommentForm();

  const form = newCommentForm.querySelector("form");
  form.addEventListener("submit", handleCommentSubmit);

  const cancelButton = newCommentForm.querySelector(".cancel");
  cancelButton.addEventListener("click", handleCancelCommentForm);

  const postIdInput = newCommentForm.querySelector(".post-id");
  postIdInput.value = target.dataset.id;

  post.insertBefore(newCommentForm, postComments);

  const nameInput = newCommentForm.querySelector("input");
  nameInput.focus();

  newCommentForm.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
  });
}

function removeCommentForm() {
  const commentFormContainer = document.querySelector(
    ".comment-form-container"
  );
  if (commentFormContainer) {
    commentFormContainer.remove();
  }
}

async function handleCommentSubmit(event) {
  event.preventDefault();
  const target = event.target;
  const commentForm = target;
  const formData = new FormData(commentForm);
  const postId = commentForm.querySelector(".post-id").value;

  const comment = {
    "author-name": formData.get("author-name"),
    content: formData.get("content"),
  };

  RenderService.showLoading(commentForm.parent);
  const result = await ApiService.createComment(postId, comment);
  RenderService.hideLoading();

  if (result.errors) {
    RenderService.displayErrors(result.errors);
  }
  if (result.success) {
    RenderService.displaySuccess(result.success);
  }

  if (result.comment) {
    const post = target.closest(".post");
    let comments = post.querySelector(".comments");

    if (!comments) {
      comments = document.createElement("div");
      comments.classList.add("comments");
      post.appendChild(comments);

      const commentsTitle = document.createElement("h5");
      commentsTitle.textContent = "Comments";
      comments.appendChild(commentsTitle);
    }

    const newComment = RenderService.createCommentElem(result.comment);
    removeCommentForm();
    comments.appendChild(newComment);
    newComment.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }
}

function handleCancelCommentForm() {
  removeCommentForm();
}

async function init() {
  await loadPosts();
}

init();
