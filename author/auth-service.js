class AuthService {
  async logIn(userData) {
    return fetch("http://localhost:3000/log-in", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return json;
      });
  }

  isLogedIn() {
    return !!localStorage.getItem("username");
  }

  get username() {
    return localStorage.getItem("username") || null;
  }

  get token() {
    return localStorage.getItem("token") || null;
  }

  get userId() {
    return localStorage.getItem("userId") || null;
  }
}

const authService = new AuthService();
