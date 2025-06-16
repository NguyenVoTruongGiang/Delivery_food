<script>
  export let onSend;
  let email = "";
  let name = "";
  let password = "";
  let otp = Array(6).fill("");
  let url = "http://localhost:8080/user/send-register-otp";

  async function handleValidate() {
    try {
      console.log (email);
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
        }),
      });

      localStorage.setItem("email", email);
      localStorage.setItem("name", name);
      localStorage.setItem("password", password);
      onSend();
    } catch (error) {
      alert("Gửi OTP thất bại!");
    }
  }
</script>

<div class="container">
  <div class="card">
    <h1>Sign Up</h1>

    <form on:submit|preventDefault={handleValidate}>
      <p>Email</p>
      <input type="email" bind:value={email} placeholder="Your email" />

      <p>Name</p>
      <input type="text" bind:value={name} placeholder="Your name" />

      <p>Password</p>
      <input type="password" bind:value={password} placeholder="Password" />

      <div class="forgot-password">Forgot password?</div>

      <button class="btn-login" on:click={handleValidate}>Sign Up</button>
    </form>

    <p>
      Already have an account?
      <a href="/login" class="login-link">Login</a>
    </p>

    <div class="divider">Or sign in with</div>

    <button class="btn-social facebook">
      <img
        src="https://cdn-icons-png.flaticon.com/512/124/124010.png"
        alt="Facebook"
      />
      Continue with Facebook
    </button>

    <button class="btn-social google">
      <img
        src="https://ssl.gstatic.com/images/branding/product/2x/gsa_512dp.png"
        alt="Google"
      />
      Continue with Google
    </button>
  </div>
</div>

<style>
  /* Thiết lập bố cục căn giữa */
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #f8f8f8;
    padding: 20px;
  }

  /* Card chứa form */
  .card {
    width: 100%;
    max-width: 400px;
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
    text-align: left;
  }

  p {
    font-size: 14px;
    margin-bottom: 6px;
    text-align: left;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 10px;
    margin-top: 6px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
  }

  .forgot-password {
    text-align: right;
    color: #f97316;
    font-size: 12px;
    margin-top: 5px;
    cursor: pointer;
  }

  .btn-login {
    width: 100%;
    padding: 12px;
    background: #f97316;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 12px;
    transition: background 0.3s ease;
  }

  .btn-login:hover {
    background: #e65a00;
  }

  .login-link {
    color: #f97316;
    font-weight: bold;
    text-decoration: none;
  }

  .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 16px 0;
    font-size: 14px;
    color: #888;
  }

  .btn-social {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    border: none;
    padding: 10px;
    font-size: 14px;
    cursor: pointer;
    border-radius: 8px;
    margin-top: 8px;
    transition: opacity 0.3s ease;
  }

  .btn-social img {
    width: 20px;
    margin-right: 8px;
  }

  .facebook {
    background: #1877f2;
    color: white;
  }

  .facebook:hover {
    opacity: 0.85;
  }

  .google {
    background: white;
    color: black;
    border: 1px solid #ddd;
  }

  .google:hover {
    background: #f1f1f1;
  }

  /* Responsive */
  @media (max-width: 480px) {
    .card {
      padding: 16px;
    }

    h1 {
      font-size: 22px;
    }

    input {
      font-size: 14px;
    }

    .btn-login {
      font-size: 14px;
    }
  }

  @media (min-width: 768px) {
    .card {
      max-width: 450px;
    }
  }
</style>
