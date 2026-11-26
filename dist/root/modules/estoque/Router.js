import { ControllerEstoque } from "./Controller.js";
export function Estoque_Route(app) {
    app.post("/estoque", ControllerEstoque.CreateController);
    app.put("/estoque", ControllerEstoque.UpdateController);
    app.delete("/estoque/:id", ControllerEstoque.DeleteController);
    app.get("/estoque", ControllerEstoque.FindAllController);
    app.get("/estoque/:id", ControllerEstoque.FindByIdController);
}
