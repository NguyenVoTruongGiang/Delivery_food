<script>
  import { onMount } from "svelte";

  let otp = ["", "", "", ""]; // Lưu trữ 4 số OTP
  let errorMessage = "";
  let email = "kattyberry@gmail.com"; // Thay bằng email thực tế
  let canResend = false;
  let countdown = 30; // Đếm ngược thời gian gửi lại OTP

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
      errorMessage = ""; // Xóa lỗi nếu có
      if (index <= otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    } else {
      event.target.value = ""; // Xóa nếu nhập sai
    }
  }

  // Xử lý khi nhấn Enter hoặc kiểm tra hợp lệ
  function handleSubmit() {
    if (otp.includes("")) {
      errorMessage = "Vui lòng nhập đầy đủ mã OTP";
    } else {
      console.log("Mã OTP hợp lệ:", otp.join(""));
      errorMessage = "";
      // Xử lý gửi OTP lên server ở đây...
    }
  }

  // Gửi lại mã OTP
  function resendOTP() {
    if (canResend) {
      console.log("Gửi lại mã OTP...");
      otp = ["", "", "", ""];
      canResend = false;
      countdown = 30;
      errorMessage = "";
      onMount();
    }
  }
</script>

<main class="container">
  <h2>Verification Code</h2>
  <p>Please enter the verification code sent to <strong>{email}</strong></p>

  <div class="otp-inputs">
    {#each otp as index}
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

  <button on:click={handleSubmit}>Verify</button>

  <div>
    <p>Haven't received a code?</p>
    <span class="resend {canResend ? '' : 'disabled'}" on:click={resendOTP}>
      {canResend ? "Resend" : `Resend in ${countdown}s`}
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