import { types } from "mobx-state-tree";
import { TimeLogModel } from "./TimeLogModel";

export const TimeLogStoreModel = types.model("TimeLogStore", {
  items: types.optional(types.array(TimeLogModel), []),
  currentTimer: types.maybe(types.late(() => types.reference(TimeLogModel)))
})
  .actions(self => ({
    taskDuration(taskId: string) {
      return self.items.reduce((acc, item) => {
        if (item?.task?.id === taskId) {
          acc += item.duration;
        }
        return acc;
      }, 0);
    },
    start({ taskId }: { taskId: string }) {
      // сначала нужно остановить текущий таймер, если он есть
      if (self.currentTimer) {
        self.currentTimer.stop();
        self.currentTimer = undefined;
      }
      // создаем новый таймер
      const currentDuration = this.taskDuration(taskId);
      const newTimer = TimeLogModel.create({
        id: Math.random().toString(),
        task: taskId,
        startTime: new Date(),
      });
      self.items.push(newTimer);
      self.currentTimer = newTimer;
      // найти все TimeLogModel по taskId и подсчитать продолжительность их всех
      return currentDuration;
    },
    stop({ taskId }: { taskId: string }) {
      const timeLog = self.items.find(item => item?.task?.id === taskId && !item.endTime);
      if (!timeLog) return;
      timeLog?.stop();
      self.currentTimer = undefined;
      return this.taskDuration(timeLog?.task?.id || "");
    },
  }))
