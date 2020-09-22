import "reflect-metadata";

import Init from "./init";

import ScriptController from "./script/scriptController";
import SceneController from "./scene/sceneController";
import InventoryController from "./inventory/inventoryController";
import ActorController from "./actors/actorsController";
import ScheduleController from "./timeTable/timeTableController";

const app = new Init([
  new ScriptController(),
  new SceneController(),
  new InventoryController(),
  new ActorController(),
  new ScheduleController(),
]);

app.listen();
