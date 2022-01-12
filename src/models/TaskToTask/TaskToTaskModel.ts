import { types } from "mobx-state-tree";
import { TaskModel } from "../Task/TaskModel";


export const TaskToTaskModel = types.model("Task").props({
    id: types.identifier,
    parent: types.reference(types.late(() => TaskModel)),
    children: types.reference(types.late(() => TaskModel)),
    blocker: types.optional(types.boolean, false),
});
