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
      console.error(error);
    }
    return [];
  }
}

const apiService = new ApiService();
