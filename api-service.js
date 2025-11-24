class ApiService {
  static async makeRequest(endpoint, method, data, includeToken = false) {
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

      return result.posts;
    } catch (error) {
      if (error.message.startsWith("NetworkError")) {
        return { errors: [error.message] };
      }
      console.error(error);
    }
    return [];
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
      if (error.message.startsWith("NetworkError")) {
        return { errors: [error.message] };
      }
      console.error(error);
    }
  }
}
