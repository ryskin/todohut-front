import { Gantt, Task as TaskGantt, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import { observer } from 'mobx-react';
import { useStore } from '../../models/StoreContext';
import "gantt-task-react/dist/index.css";


export const GanttPage = observer(() => {
    const store = useStore();
    
    if (store.task.items.length === 0) return null;
    let tasks: TaskGantt[] = store.task.items.map(task => {
        return {
            id: task.id,
            name: task.name,
            start: new Date(2022, 1, 1),
            end: new Date(2022, 1, 3),
            type: 'task',
            isDisabled: true,
            progress: 10,
            styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
        }
    });

    console.log(tasks);
    
    return (
        <div>
            <h1>Gantt</h1>
            <Gantt tasks={tasks} />
        </div>
    );
});