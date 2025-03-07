<script>
  export let onSingUp;
  let name = "";
  let email = "";
  let password = "";

  function handleRegister() {
    if (name != null && email != null && password != null) {
      console.log("Đăng ký thành công");
      onSingUp();
    } else {
      console.log("Email hoặc mật khẩu không chính xác");
    }
  }
</script>

<div class="container">
  <div class="card">
    <h1>Login</h1>
    <form form on:submit|preventDefault={handleRegister}>
      <p>Name</p>
      <input type="name" bind:value={name} placeholder="Your name" />

      <p>Email</p>
      <input type="email" bind:value={email} placeholder="Your email" />

      <p>Password</p>
      <input type="password" bind:value={password} placeholder="Password" />
      <div class="forgot-password">Forgot password?</div>

      <button class="btn-login">Login</button>
    </form>
    <p>
      Already have an account? <a
        href="/login"
        style="color:#f97316; font-weight:bold">Login</a
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
    width: 350px;
    padding: 20px;
    text-align: center;
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
</style>
