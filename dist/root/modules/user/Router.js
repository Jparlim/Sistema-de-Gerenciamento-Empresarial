import { User_Controller } from "./Controller.js";
export async function User_Route(app) {
    app.get("/user", User_Controller.FindAllUsers);
    app.get("/user/:id", User_Controller.FindByIdUser);
    app.post("/user", User_Controller.CreateUser);
    app.delete("/user/:id", User_Controller.DeleteUser);
}
