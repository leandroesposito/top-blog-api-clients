class ApiService {
  static async makeRequest(
    endpoint,
    method,
    data = null,
    includeToken = false
  ) {
    const options = {
      mode: "cors",
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (includeToken) {
      options.headers.Authorization = localStorage.getItem("token") || null;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    return fetch(endpoint, options)
      .then((response) => {
        if (response.status === 404) {
          return { error: "404" };
        }

        return response.json();
      })
      .then((json) => {
        return json;
      })
      .catch((error) => {
        console.error(error);
        if (error.message.startsWith("NetworkError")) {
          return { errors: [error.message] };
        }
        throw error;
      });
  }

  static async getUserPosts(userId, includeToken) {
    try {
      const result = await ApiService.makeRequest(
        `http://localhost:3000/posts/author/${userId}`,
        "GET",
        null,
        includeToken
      );

      return result;
    } catch (error) {
      console.error(error);
    }
    return [];
  }

  static async getPostById(id) {
    try {
      const result = await ApiService.makeRequest(
        `http://localhost:3000/posts/${id}`,
        "GET",
        null,
        true
      );

      return result;
    } catch (error) {
      console.error(error);
    }
  }

  static async getAllPosts() {
    try {
      const result = await ApiService.makeRequest(
        `http://localhost:3000/posts`,
        "GET"
      );

      return result;
    } catch (error) {
      console.error(error);
    }
  }

  static async createPost(post) {
    try {
      const result = await ApiService.makeRequest(
        `http://localhost:3000/posts`,
        "POST",
        post,
        true
      );

      return result;
    } catch (error) {
      console.error(error);
    }
  }

  static async editPost(post) {
    try {
      const result = await ApiService.makeRequest(
        `http://localhost:3000/posts/${post.id}`,
        "PUT",
        post,
        true
      );

      return result;
    } catch (error) {
      console.error(error);
    }
  }

  static async deletePost(id) {
    try {
      const response = await ApiService.makeRequest(
        `http://localhost:3000/posts/${id}`,
        "DELETE",
        null,
        true
      );

      return response;
    } catch (error) {
      console.error(error);
    }
  }

  static async createComment(postId, data) {
    try {
      const response = await ApiService.makeRequest(
        `http://localhost:3000/posts/${postId}/comments`,
        "POST",
        data
      );

      return response;
    } catch (error) {
      console.error(error);
    }
  }

  static async deleteComment(id) {
    try {
      const response = await ApiService.makeRequest(
        `http://localhost:3000/comments/${id}`,
        "DELETE",
        null,
        true
      );

      return response;
    } catch (error) {
      console.error(error);
    }
  }
}
