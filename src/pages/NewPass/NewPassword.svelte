<script>
  export let onSend;
  let email = "";

  function handleSendMailTakePass() {
    if (email != null) {
      console.log("Email hợp lệ");
      onSend();
    } else {
      console.log("Email hoặc mật khẩu không chính xác");
    }
  }
</script>

<div class="container">
  <div class="card">
    <h1>Login</h1>
    <h4>Please enter your email address to request a password reset</h4>
    <form form on:submit|preventDefault={handleSendMailTakePass}>
      <p>Email</p>
      <input type="email" bind:value={email} placeholder="Your email" />

      <button class="btn-login">Send</button>
    </form>
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
</style>
