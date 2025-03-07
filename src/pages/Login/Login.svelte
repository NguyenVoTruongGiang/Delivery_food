<script>
  export let onLoginSuccess;
  let email = "";
  let password = "";

  function handleLogin() {
    if (email === "giang@gmail.com" && password === "123") {
      console.log("Đăng nhập thành công");
      onLoginSuccess();
    } else {
      console.log("Email hoặc mật khẩu không chính xác");
    }
  }
</script>

<div class="container">
  <div class="card">
    <h1>Login</h1>
    <form form on:submit|preventDefault={handleLogin}>
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
      Don't have an account? <a
        href="/register"
        style="color:#f97316; font-weight:bold">Sign Up</a
      >
    </p>

    <div class="divider">Sign in with</div>

    <button class="btn-social">
      <img
        src="https://cdn-icons-png.flaticon.com/512/124/124010.png"
        alt="Facebook"
      />
      Continue with Facebook
    </button>
    <button class="btn-social">
      <img
        src="https://ssl.gstatic.com/images/branding/product/2x/gsa_512dp.png"
        alt="Google"
      />
      Continue with Google
    </button>
  </div>
</div>

<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: white;
  }

  .card {
    width: 90%;
    max-width: 350px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }

  .card form p {
    display: flex;
  }

  h1 {
    font-size: 24px;
    font-weight: bold;
    text-align: left;
  }

  input {
    width: 100%;
    padding: 10px;
    margin-top: 8px;
    border: 1px solid #ddd;
    border-radius: 6px;
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
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 12px;
  }

  .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 16px 0;
  }

  .btn-social {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    background: white;
    border: 1px solid #ddd;
    padding: 10px;
    cursor: pointer;
    border-radius: 6px;
    font-size: 14px;
    margin-top: 10px;
  }

  .btn-social img {
    width: 20px;
    margin-right: 8px;
  }

  /* Responsive styles */
  @media (max-width: 320px) {
    .container {
      padding: 10px;
    }

    .card {
      width: 100%;
      padding: 15px;
    }

    h1 {
      font-size: 20px;
    }

    .btn-login {
      font-size: 14px;
    }

    .btn-social {
      font-size: 12px;
    }

    .forgot-password {
      font-size: 10px;
    }
  }

  @media (min-width: 321px) and (max-width: 768px) {
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      background: white;
      /* padding: 20px; */
    }

    .card {
      max-width: 100%;
      padding: 20px;
    }

    h1 {
      font-size: 22px;
    }

    .btn-login {
      font-size: 15px;
    }

    .btn-social {
      font-size: 13px;
    }

    .forgot-password {
      font-size: 11px;
    }
  }

  @media (min-width: 1024px) {
    .container {
      padding: 30px;
    }

    .card {
      width: 80%;
      padding: 25px;
    }

    h1 {
      font-size: 26px;
    }

    .btn-login {
      font-size: 18px;
    }

    .btn-social {
      font-size: 16px;
    }

    .forgot-password {
      font-size: 13px;
    }
  }
</style>
