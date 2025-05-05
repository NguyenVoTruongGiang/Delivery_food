<script>
  export let onLoginSuccess;
  let email = "";
  let password = "";

  function handleLogin() {
    if (email === "giang@gmail.com" && password === "123") {
      console.log("✅ Đăng nhập thành công");
      onLoginSuccess();
    } else {
      console.log("❌ Email hoặc mật khẩu không chính xác");
    }
  }
</script>

<div class="container">
  <div class="card">
    <h1>Login</h1>
    
    <form on:submit|preventDefault={handleLogin}>
      <p>Email</p>
      <input type="email" bind:value={email} placeholder="Your email" />

      <p>Password</p>
      <input type="password" bind:value={password} placeholder="Password" />

      <div class="forgot-password">
        <a href="/newPass">Forgot password?</a>
      </div>

      <button class="btn-login">Login</button>
    </form>

    <p>
      Don't have an account? 
      <a href="/register" class="sign-up-link">Sign Up</a>
    </p>

    <div class="divider">Or sign in with</div>

    <button class="btn-social facebook">
      <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" />
      Continue with Facebook
    </button>

    <button class="btn-social google">
      <img src="https://ssl.gstatic.com/images/branding/product/2x/gsa_512dp.png" alt="Google" />
      Continue with Google
    </button>
  </div>
</div>

<style>
  /* Căn giữa login form */
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #f8f8f8;
    padding: 20px;
  }

  /* Hộp đăng nhập */
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
    text-align: left;
  }

  p {
    font-size: 14px;
    text-align: left;
    font-weight: 500;
    margin: 10px 0 5px;
  }

  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
  }

  .forgot-password {
    text-align: right;
    margin-top: 5px;
  }

  .forgot-password a {
    color: #f97316;
    font-size: 12px;
    text-decoration: none;
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

  .sign-up-link {
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

  /* Nút login với mạng xã hội */
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

  /* 🎯 Responsive */
  @media (max-width: 480px) {
    .container {
      padding: 10px;
    }

    .card {
      padding: 18px;
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

    .btn-social {
      font-size: 12px;
    }
  }

  @media (min-width: 768px) {
    .card {
      max-width: 450px;
    }
  }
</style>
