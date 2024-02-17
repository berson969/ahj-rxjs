import "./css/style.css";
import "./js/app";
import "./bootstrap-5.0.1-dist/js/bootstrap.bundle.min.js";
import "./bootstrap-5.0.1-dist/css/bootstrap.min.css";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./service-worker.js", { scope: "/" })
    .then((reg) => {
      // регистрация сработала
      console.log("Registration succeeded. Scope is " + reg.scope);
    })
    .catch((error) => {
      // регистрация прошла неудачно
      console.log("Registration failed with " + error);
    });
}
