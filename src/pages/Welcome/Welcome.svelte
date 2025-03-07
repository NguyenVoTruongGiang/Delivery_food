<script>
  let username = "";
  let password = "";
  let url = "https://byvn.net/ZXk3";

  function handleEmailLogin() {
    console.log("Logging in with email...");
  }

  function handleFacebookLogin() {
    console.log("Logging in with Facebook...");
  }

  function handleGoogleLogin() {
    console.log("Logging in with Google...");
  }
</script>

<div class="container">
  <!-- Background Image -->
  <div class="header">
    <img src={url} alt="Fast Food" class="img_wel"/>
  </div>
  <div class="card">
    <!-- Content -->
    <div class="content">
      <h1>Welcome to <br /><span>Fast Food</span></h1>
      <p>Get your favourite meals delivered quickly right to your doorstep</p>

      <!-- Start with Email -->
      <button on:click={handleEmailLogin} class="btn btn-email">
        <a href="/login">Start with email</a>
      </button>

      <!-- Sign in with -->
      <div class="divider">Sign in with</div>

      <!-- Social Login Buttons -->
      <button on:click={handleFacebookLogin} class="btn btn-social btn-facebook">
        <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" />
        Continue with Facebook
      </button>
      <button on:click={handleGoogleLogin} class="btn btn-social">
        <img src="https://ssl.gstatic.com/images/branding/product/2x/gsa_512dp.png"/>
        Continue with Google
      </button>

      <!-- Sign In Link -->
      <p class="signin-text">
        Already have an account?
        <a href="/login">Sign In</a>
      </p>
    </div>
  </div>
</div>

<style>
  .container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(to bottom, white, #ea7525);
  }

  .card {
    position: absolute;
    width: 90%;
    max-width: 350px;
    overflow: hidden;
    text-align: center;
    z-index: 1;
  }

  .container .header {
    position: absolute;
    top: 0;
  }

  .header {
    position: relative;
    width: 100%;
    height: 90%;
  }
  
  .img_wel {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.15;
    top: 0;
    z-index: 0;
  }

  .content {
    padding: 20px;
  }

  .content h1 {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }

  .content h1 span {
    color: #f97316;
  }

  .content p {
    font-size: 14px;
    color: #666;
    margin-top: 8px;
  }

  .btn {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 12px;
  }

  .btn.btn-email {
    background: black;
  }
  
  .btn.btn-email a {
    color: white;
    text-decoration: none;
  }

  .btn-email:hover {
    background: #333;
  }

  .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 16px 0;
    color: #666;
    font-size: 14px;
  }

  .divider::before,
  .divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #ddd;
    margin: 0 10px;
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

  .btn-facebook:hover {
    background: #0f65d4;
  }

  .btn-social img {
    width: 20px;
    margin-right: 8px;
  }

  .signin-text {
    font-size: 14px;
    color: #666;
    margin-top: 16px;
  }

  .signin-text a {
    color: #f97316;
    font-weight: bold;
    text-decoration: none;
  }

  .signin-text a:hover {
    text-decoration: underline;
  }

  /* Responsive styles */
  @media (max-width: 320px) {
    .content h1 {
      font-size: 20px;
    }

    .btn {
      font-size: 14px;
    }

    .btn-social {
      font-size: 12px;
    }

    .signin-text {
      font-size: 12px;
    }
  }

  @media (min-width: 321px) and (max-width: 768px) {
    .content h1 {
      font-size: 22px;
    }

    .btn {
      font-size: 15px;
    }

    .btn-social {
      font-size: 13px;
    }

    .signin-text {
      font-size: 13px;
    }
  }

  @media (min-width: 1024px) {
    .content h1 {
      font-size: 26px;
    }

    .btn {
      font-size: 18px;
    }

    .btn-social {
      font-size: 16px;
    }

    .signin-text {
      font-size: 16px;
    }
  }
</style>