<script>
  import { onMount } from "svelte";
  export let onSignUp;

  let email = localStorage.getItem("email") || "";
  let name = localStorage.getItem("name") || "";
  let password = localStorage.getItem("password") || "";

  let otp = Array(6).fill(""); // Lưu trữ 6 số OTP
  let errorMessage = "";
  let canResend = false;
  let countdown = 30; // Đếm ngược thời gian gửi lại OTP
  let url = "http://localhost:8080/user/register";

  // Chạy bộ đếm thời gian gửi lại mã OTP
  onMount(() => {
    const timer = setInterval(() => {
      if (countdown > 0) {
        countdown--;
      } else {
        canResend = true;
        clearInterval(timer);
      }
    }, 1000);
  });

  // Xử lý nhập OTP
  function handleInput(index, event) {
    let value = event.target.value;
    if (/^\d$/.test(value)) {
      otp[index] = value;
      errorMessage = "";
      if (index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    } else {
      event.target.value = "";
    }
  }

  // Xử lý khi nhấn Enter hoặc kiểm tra hợp lệ
  async function handleRegister() {
    console.log({ email, name, password });
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or name or password");
      }
      onSignUp();
      console.log("Đăng ký thành công");
    } catch (error) {
      console.error("Đăng ký thất bại:", error.message);
    }
  }

  // Gửi lại mã OTP
  async function resendOTP() {
    console.log(email);
    const data = await response.json();
    await fetch("http://localhost:8080/user/send-register-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
      }),
    });
    onSend();
  }
</script>

<main class="container">
  <h2>Mã Xác Minh</h2>
  <p>Vui lòng nhập mã xác minh được gửi đến <strong>{email}</strong></p>

  <div class="otp-inputs">
    {#each otp as _, index}
      <input
        type="text"
        id={"otp-" + index}
        maxlength="1"
        bind:value={otp[index]}
        on:input={(event) => handleInput(index, event)}
      />
    {/each}
  </div>

  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}

  <button on:click={handleRegister}>Xác nhận</button>

  <div>
    <p>Chưa nhận được mã?</p>
    <span class="resend {canResend ? '' : 'disabled'}" on:click={resendOTP}>
      {canResend ? "Gửi lại" : `Gửi lại sau ${countdown} giây`}
    </span>
  </div>
</main>

<style>
  .container {
    max-width: 400px;
    margin: 50px auto;
    text-align: center;
    font-family: sans-serif;
  }

  .otp-inputs {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 15px;
  }

  input {
    width: 50px;
    height: 50px;
    font-size: 20px;
    text-align: center;
    border: 2px solid #ddd;
    border-radius: 5px;
    outline: none;
  }

  input:focus {
    border-color: orange;
  }

  .error {
    color: red;
    margin-top: 10px;
  }

  .resend {
    color: orange;
    cursor: pointer;
    margin-top: 10px;
    text-decoration: underline;
  }

  .resend.disabled {
    color: gray;
    pointer-events: none;
  }

  button {
    width: 100%;
    margin-top: 20px;
    padding: 10px;
    background-color: orange;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
  }

  button:disabled {
    background-color: gray;
    cursor: not-allowed;
  }
</style>
