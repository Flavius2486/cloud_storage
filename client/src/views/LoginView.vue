<template>
  <div class="container">
    <div class="login-box">
      <h2>Login</h2>
      <div class="form-error transparent">
        <i>Incorrect email and/or password</i>
      </div>
      <form>
        <div class="user-box">
          <input
            v-model="email_username"
            type="text"
            class="email_username-input"
            required
            @keyup.enter="handleLogin"
            @focus="updateInputColor($event, 0)"
          />
          <label class="username-placeholder">Email or username</label>
          <i class="input-error hidden">Field cannot be empty!</i>
        </div>
        <div class="user-box">
          <input
            v-model="password"
            type="password"
            class="password-input"
            required
            @keyup.enter="handleLogin"
            @focus="updateInputColor($event, 1)"
          />
          <label class="password-placeholder">Password</label>
          <i class="input-error hidden">Field cannot be empty!</i>
        </div>
        <!-- <div class="remember-me-box" @click="rememberMe">
          <div>
            <input type="checkbox" @click.stop />
            <p>Remember me</p>
          </div>
        </div> -->
        <a class="submit-btn" type="submit" @click="handleLogin">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Submit
        </a>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email_username: "",
      password: "",
      // remberMe: false,
    };
  },
  methods: {
    updateInputColor(event, index) {
      document.querySelector(".form-error").classList.add("transparent");
      document.querySelectorAll(".user-box label")[index].style.color = "white";
      document.querySelectorAll(".input-error")[index].classList.add("hidden");
      event.target.style.borderColor = "#ffffff";
    },

    handleLogin() {
      let error = false;

      const inputs = document.querySelectorAll(".user-box input");
      const labels = document.querySelectorAll(".user-box label");
      const errors = document.querySelectorAll(".input-error");

      inputs.forEach((input, index) => {
        if (input.value.length === 0) {
          input.style.borderColor = "rgb(228, 48, 48)";
          labels[index].style.color = "rgb(228, 48, 48)";
          errors[index].classList.remove("hidden");
          error = true;
        }
      });

      if (!error) {
        axios
          .post(
            `/api/login`,
            {
              email_username: this.email_username,
              password: this.password,
              // remember: this.remberMe,
            },
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            if (response.data.auth) {
              this.$router.replace("/dashboard");
            } else {
              document
                .querySelector(".form-error")
                .classList.remove("transparent");
              document.querySelector(".form-error i").innerHTML =
                response.data.message;
            }
          })
          .catch((error) => {
            throw error;
          });
      }
    },

    // rememberMe() {
    //   this.remberMe = !this.remberMe;
    //   document.querySelector(".remember-me-box input").checked = this.remberMe;
    // },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent,
    url("../assets/background_pattern.png") top left repeat;
}

@media (min-width: 2000px) and (min-height: 1000px) {
  body {
    background-repeat: repeat;
    background-size: 100%;
  }
}

.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  padding: 40px;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
  border-radius: 10px;
}

.login-box h2 {
  margin: 0 0 3px;
  padding: 0;
  color: #fff;
  text-align: center;
  font-size: 25px;
}

.login-box .user-box {
  position: relative;
  margin-bottom: 40px;
}

/*-----------Form inputs---------------*/

.login-box .user-box input {
  width: 100%;
  padding: 8px 0;
  font-size: 16px;
  color: #fff;
  margin-bottom: 0px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
  height: auto;
}
.login-box .user-box label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  pointer-events: none;
  transition: 0.5s;
}

.login-box .user-box input:focus ~ label,
.login-box .user-box input:valid ~ label {
  top: -20px;
  left: 0;
  font-size: 12px;
}

/*----------Remember check box----------*/
/*
.remember-me-box {
  position: absolute;
  margin-top: -18px;
  right: 40px;
  z-index: 999999;
}

.remember-me-box div {
  display: flex;
  align-items: center;
}

.remember-me-box input {
  height: 14px;
  width: 14px;
}

.remember-me-box p {
  color: #fff;
  margin-left: 5px;
  font-size: 15px;
  cursor: default;
  user-select: none;
}
*/
/*-------Errors---------------*/

.form-error {
  color: rgb(228, 48, 48);
  font-size: 15px;
  margin-bottom: 10px;
}

.input-error {
  font-size: 13px;
  color: rgb(228, 48, 48);
}

/*----------Submit button-----------*/

.submit-btn {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #03e9f4;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: 0.5s;
  margin-top: 30px;
  letter-spacing: 4px;
  cursor: default;
}

.submit-btn:hover {
  background: #0f1220;
  color: #fff;
  border-radius: 5px;
  /* box-shadow: 0 0 2px #03e9f4, 0 0 12px #03e9f4, 0 0 25px #03e9f4,
    0 0 50px #03e9f4; */
}

.login-box a span {
  position: absolute;
  display: block;
}

.login-box a span:nth-child(1) {
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #03e9f4);
  animation: btn-anim1 1s linear infinite;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }
  50%,
  100% {
    left: 100%;
  }
}

.login-box a span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #03e9f4);
  animation: btn-anim2 1s linear infinite;
  animation-delay: 0.25s;
}

@keyframes btn-anim2 {
  0% {
    top: -100%;
  }
  50%,
  100% {
    top: 100%;
  }
}

.login-box a span:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #03e9f4);
  animation: btn-anim3 1s linear infinite;
  animation-delay: 0.5s;
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }
  50%,
  100% {
    right: 100%;
  }
}

.login-box a span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #03e9f4);
  animation: btn-anim4 1s linear infinite;
  animation-delay: 0.75s;
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }
  50%,
  100% {
    bottom: 100%;
  }
}

#link {
  font-size: 15px;
  float: right;
  color: #03e9f4;
  text-decoration: none;
  height: 30px;
  width: auto;
}

@media (max-width: 450px) {
  .login-box {
    width: 90%;
  }
}

.hidden {
  display: none;
}

.transparent {
  color: transparent;
  background: transparent;
}
</style>
