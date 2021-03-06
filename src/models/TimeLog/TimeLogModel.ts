import { Instance, SnapshotOut, types, getRoot } from "mobx-state-tree";
import { TaskModel } from "../Task/TaskModel";
import { UserModel } from "../User/UserModel";

export const TimeLogModel = types
  .model("TimeLog", {
    id: types.identifier,
    task: types.reference(types.late(() => TaskModel)),
    user: types.maybe(types.reference(types.late(() => UserModel))),
    startTime: types.Date,
    endTime: types.maybe(types.Date),
  })
  .views((self) => ({
    get price() {
      return this.duration / 3600 * (self.user?.rate || 0);
    },
    get duration() {
      if (!self.endTime) {
        const timeNow = new Date();
        return timeNow.getTime() - self.startTime.getTime();
      }
      return self.endTime.getTime() - self.startTime.getTime();
    },
  }))
  .actions((self) => ({
    start() {
      self.startTime = new Date();
    },
    stop() {
      self.endTime = new Date();
    },
  }));

type TimeLogType = Instance<typeof TimeLogModel>;
export interface TimeLog extends TimeLogType {}
type TimeLogSnapshotType = SnapshotOut<typeof TimeLogModel>;
export type TimeLogSnapshot = TimeLogSnapshotType;
