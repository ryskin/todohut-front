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
  task: types.optional(TaskStoreModel, {} as any),
  list: types.optional(ListStoreModel, {} as any),
  taskStatus: types.optional(TaskStatusStoreModel, {} as any),
  taskToTask: types.optional(TaskToTaskStoreModel, {} as any),
  timeLog: types.optional(TimeLogStoreModel, {} as any),
  user: types.optional(UserStoreModel, {} as any),
  comment: types.optional(CommentStoreModel, {} as any),
  rehydrated: types.optional(types.boolean, false),
})
.actions(self => ({
  setRehydrated() {
    self.rehydrated = true;
  },
}))
.extend(
  localStorageMixin({
    throttle: 1000,
    filter: ["task", "list", "taskStatus", "taskToTask", "timeLog", "user", "comment"],
  })
);

type RootStoreType = Instance<typeof RootStoreModel>;
export interface RootStore extends RootStoreType {}
type RootStoreSnapshotType = SnapshotOut<typeof RootStoreModel>;
export type RootStoreSnapshot = RootStoreSnapshotType;