import { ControllerAdm } from "./Controller.js";
export async function Router_Adm(App) {
    App.get("/", ControllerAdm.findAllController);
    App.post("/", ControllerAdm.CreateController);
    App.delete("/:id", ControllerAdm.deleteController);
    App.put("/:id", ControllerAdm.updateController);
}
