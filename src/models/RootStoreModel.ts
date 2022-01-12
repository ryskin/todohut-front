import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { CommentStoreModel } from "./Comment/CommentStoreModel";
import { ListStoreModel } from "./List/ListStoreModel";
import { TaskStoreModel } from "./Task/TaskStoreModel";
import { TaskStatusStoreModel } from "./TaskStatus/TaskStatusStoreModel";
import { TaskToTaskStoreModel } from "./TaskToTask/TaskToTaskStoreModel";
import { TimeLogStoreModel } from "./TimeLog/TimeLogStoreModel";
import { UserStoreModel } from "./User/UserStore";
import { localStorageMixin  } from "./extensions/localStorageMixin";

export const RootStoreModel = types.model("RootStore", {
  task: types.optional(TaskStoreModel, {}),
  list: types.optional(ListStoreModel, {}),
  taskStatus: types.optional(TaskStatusStoreModel, {}),
  taskToTask: types.optional(TaskToTaskStoreModel, {}),
  timeLog: types.optional(TimeLogStoreModel, {}),
  user: types.optional(UserStoreModel, {}),
  comment: types.optional(CommentStoreModel, {}),
})
.extend(
  localStorageMixin({
    throttle: 1000,
  })
);

type RootStoreType = Instance<typeof RootStoreModel>;
export interface RootStore extends RootStoreType {}
type RootStoreSnapshotType = SnapshotOut<typeof RootStoreModel>;
export type RootStoreSnapshot = RootStoreSnapshotType;