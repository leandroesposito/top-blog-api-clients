class RenderService {
  static createPostElem(post) {
    const newPost = document.createElement("div");
    newPost.classList.add("post");

    const title = document.createElement("div");
    title.classList.add("post-title");
    title.textContent = post.title;
    newPost.appendChild(title);

    const author = document.createElement("div");
    author.classList.add("post-author");
    author.textContent = post.author.username;
    newPost.appendChild(author);

    const date = document.createElement("div");
    date.classList.add("post-date");
    date.textContent = post.date;
    newPost.appendChild(date);

    const content = document.createElement("div");
    content.classList.add("post-content");
    content.textContent = post.content;
    newPost.appendChild(content);

    const comments = document.createElement("div");
    comments.classList.add("comments");
    newPost.appendChild(comments);

    if (post.comments) {
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

    const authorName = document.createElement("div");
    authorName.classList.add("authorName");
    authorName.textContent = comment.authorName;
    commentContainer.appendChild(authorName);

    const date = document.createElement("div");
    date.classList.add("date");
    date.textContent = comment.date;
    commentContainer.appendChild(date);

    const content = document.createElement("div");
    content.classList.add("content");
    content.textContent = comment.content;
    commentContainer.appendChild(content);

    return commentContainer;
  }
}
