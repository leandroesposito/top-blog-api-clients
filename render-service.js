class RenderService {
  static createPostElem(post) {
    const newPost = document.createElement("article");
    newPost.classList.add("post");

    const title = document.createElement("h4");
    title.classList.add("post-title");
    title.textContent = post.title;
    newPost.appendChild(title);

    const postData = document.createElement("div");
    postData.classList.add("post-data");

    const author = document.createElement("div");
    author.classList.add("post-author");
    author.textContent = "By " + post.author.username;
    postData.appendChild(author);

    const date = document.createElement("div");
    date.classList.add("post-date");
    date.textContent = post.date;
    postData.appendChild(date);

    newPost.appendChild(postData);

    const content = document.createElement("pre");
    content.classList.add("post-content");
    content.textContent = post.content;
    newPost.appendChild(content);

    if (post.comments && post.comments.length > 0) {
      const comments = document.createElement("div");
      comments.classList.add("comments");
      newPost.appendChild(comments);

      const commentsTitle = document.createElement("h5");
      commentsTitle.textContent = "Comments";
      comments.appendChild(commentsTitle);

      post.comments.forEach((comment) => {
        const commentContainer = this.createCommentElem(comment);
        comments.appendChild(commentContainer);
      });
    }

    return newPost;
  }

  static createCommentElem(comment) {
    const commentContainer = document.createElement("div");
    commentContainer.classList.add("comment");

    const commentData = document.createElement("div");
    commentData.classList.add("comment-data");

    const authorName = document.createElement("div");
    authorName.classList.add("author-name");
    authorName.textContent = comment.authorName;
    commentData.appendChild(authorName);

    const date = document.createElement("div");
    date.classList.add("date");
    date.textContent = comment.date;
    commentData.appendChild(date);

    commentContainer.appendChild(commentData);

    const content = document.createElement("div");
    content.classList.add("content");
    content.textContent = comment.content;
    commentContainer.appendChild(content);

    return commentContainer;
  }

  static createCommentForm() {
    const commentFormContainer = document.createElement("div");
    commentFormContainer.classList.add("comment-form-container");

    const commentFormHtml = `
        <form class="comment-form">
          <h3>New comment</h3>
          <div class="form-row">
            <label for="author-name">Name</label>
            <input type="text" name="author-name" id="author-name" required />
          </div>
          <div class="form-row">
            <label for="content">Content</label>
            <textarea name="content" id="content" rows="3" required ></textarea>
          </div>
          <input type="hidden" class="post-id" value="" />
          <div class="buttons">
            <button type="submit" class="button submit">Submit</button>
            <button type="button" class="button cancel">Cancel</button>
          </div>
        </form>
        <div class="loading hidden"></div>
      `;

    commentFormContainer.innerHTML = commentFormHtml;

    return commentFormContainer;
  }

  static displayErrors(errors, selector = ".errors", container = document) {
    const errorsContainer = container.querySelector(selector);
    errorsContainer.classList.remove("hidden");

    for (const error of errors) {
      const errorElement = document.createElement("div");
      errorElement.classList.add("error");
      errorElement.textContent = error;
      errorsContainer.appendChild(errorElement);
    }
    errorsContainer.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }

  static displaySuccess(
    message,
    selector = ".successes",
    container = document
  ) {
    const sucessContainer = container.querySelector(selector);
    sucessContainer.classList.remove("hidden");

    const sucessElement = document.createElement("div");
    sucessElement.classList.add("success");
    sucessElement.textContent = message;
    sucessContainer.appendChild(sucessElement);
    sucessContainer.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }

  static #getLoadingElement(container) {
    if (typeof container === "string") {
      container = document.querySelector(container);
    }

    return container.querySelector(".loading");
  }

  static showLoading(container = document) {
    const loadingElement = RenderService.#getLoadingElement(container);
    loadingElement.classList.remove("hidden");
    loadingElement.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }

  static hideLoading(container = document) {
    const loadingElement = RenderService.#getLoadingElement(container);
    loadingElement.classList.add("hidden");
  }
}
