import { ControllerLogin } from "./Controller.js";
export async function Login_Route(app) {
    app.post("/login", ControllerLogin.validateUser);
    app.post("/login/adm", ControllerLogin.validateAdmin);
    app.post("/logout", ControllerLogin.logout);
    app.post("/forgot-password", ControllerLogin.forgotPassword);
    app.post("/forgot-password/new-password", ControllerLogin.newPassword);
}
