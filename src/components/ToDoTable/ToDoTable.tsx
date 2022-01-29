import { FlagIcon } from "@heroicons/react/solid";
import {
  CalendarIcon,
  ViewGridAddIcon,
  ReplyIcon,
  FolderAddIcon,
  FolderIcon,
  FolderOpenIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/outline";
import { observer } from "mobx-react-lite";
import { CellProps } from "react-table";
import { Task } from "../../models/Task/TaskModel";
import { Table } from "../Table/Table";
import { AddTaskForm } from "../AddTaskForm/AddTaskForm";
import { useStore } from "../../models/StoreContext";
import { AddTaskStatusForm } from "../AddTaskStatusForm/AddTaskStatusForm";
import { getIdealTextColor } from "../../utils/basic";
import { Modal } from "../Modal";
import { TimerCell } from "../TimerCell/TimerCell";
import { UsersPopover } from "../UsersPopover/UsersPopover";
import { TimeEstimateCell } from "../TimeEstimateCell";
import { Popover } from "../Popover";
import { DatePicker } from "../DatePicker";
import { formatDistanceToNowStrict, isToday, isTomorrow } from "date-fns";
import { PriorityPopover } from "../PriorityPopover";
import { useCallback, useMemo, useRef } from "react";
import { TaskMenu } from "../TaskMenu/TaskMenu";

type GropedTasks = {
  [key: string]: Task[] | any;
};

export const ToDoTable = observer(() => {
  const {
    task: taskStore,
    taskStatus: taskStatusStore,
    list: listStore,
  } = useStore();
  const outerRef = useRef(null);

  const groupedTasksByStatus = useCallback(
    () =>
      taskStore.parents
        .filter((task) => task?.list?.id === listStore?.selected?.id)
        .reduce((acc: GropedTasks, task) => {
          const {
            status: { name: statusName },
          } = task;
          if (!acc[statusName]) {
            acc[statusName] = [];
          }
          acc[statusName].push({
            ...task,

            subRows: task?.subTasks.map((task) => ({
              ...task,
              subRow: true,
              subRows: task?.subTasks,
            })),
          });
          return acc;
        }, {}),
    [listStore?.selected?.id, taskStore.parents]
  );

  const columns = useMemo(
    () => [
      {
        id: "id",
        Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }: any) => (
          <span {...getToggleAllRowsExpandedProps()}>
            {isAllRowsExpanded ? "👇" : "👉"}
          </span>
        ),
        Cell: ({ row }: CellProps<any>) =>
          row.canExpand ? (
            <div
              {...row.getToggleRowExpandedProps({
                // className: "ml-2",
                style: {
                  paddingLeft: `${row.depth * 0.5}rem`,
                },
              })}
            >
              {row.isExpanded ? (
                <FolderOpenIcon className="w-4 h-4 text-gray-500" />
              ) : (
                <FolderIcon className="w-4 h-4 text-gray-500" />
              )}
            </div>
          ) : (
            <>
              {row.original.parent ? (
                <div
                  {...row.getToggleRowExpandedProps({
                    style: {
                      paddingLeft: `${row.depth * 0.5}rem`,
                    },
                  })}
                >
                  <ReplyIcon className="rotate-180 w-4 h-4 text-gray-400 cursor-not-allowed" />
                </div>
              ) : (
                ""
              )}
            </>
          ),
      },
      // {
      //   accessor: "status",
      //   disableFilters: true,
      //   Cell: ({ value }: CellProps<Task>) => value.name,
      // },
      {
        Header: "Name",
        accessor: "name",
        disableFilters: true,
        Cell: ({ row, value }: CellProps<any>) => {
          const handleNameClick = () => {
            alert(value);
          };
          return (
            <div className={"block text-gray-700 max-w-2xl"}>
              <span
                onDoubleClick={handleNameClick}
                className={`${
                  row.original.subRow ? "font-semibold" : "font-bold"
                } inline whitespace-normal`}
              >
                {value}
              </span>
              <Modal
                title={`Add task ${`to ${row.original.name}`}`}
                classNameWrapper="inline"
                clickComponent={
                  <ViewGridAddIcon className="inline w-3 h-3 text-gray-400 cursor-pointer ml-1" />
                }
              >
                <AddTaskForm
                  statusId={row.original.status.id}
                  parentId={row.original.id}
                />
              </Modal>
            </div>
          );
        },
      },
      {
        Header: "Time estimate",
        accessor: "timeEstimate",
        disableFilters: true,
        Cell: ({
          value,
          row: {
            original: { id },
          },
        }: CellProps<Task>) => <TimeEstimateCell taskId={id} />,
      },
      {
        Header: "Time tracked",
        disableFilters: true,
        Cell: ({ row }: CellProps<any>) => (
          <div className="flex items-center text-xs gap-1">
            <TimerCell taskId={row.original.id} />
          </div>
        ),
      },
      {
        Header: "Assignees",
        accessor: "assignees",
        disableFilters: true,
        Cell: ({ row }: CellProps<any>) => (
          <UsersPopover taskId={row.original.id} />
        ),
      },
      {
        Header: "Due date",
        accessor: "dueDate",
        disableFilters: true,
        Cell: ({ value, row }: CellProps<any>) => {
          const onChange = (date: Date) => {
            taskStore.update(row.original.id, { dueDate: date });
          };
          const now = new Date();
          const isPast = now > value;

          return (
            <div className="flex">
              <Popover
                clickComponent={
                  <div
                    className={`${
                      isPast ? "text-red-600" : "text-gray-400"
                    } flex text-xs`}
                  >
                    {!value && (
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                    )}
                    {isToday(value) && "Today"}
                    {isTomorrow(value) && "Tomorrow"}
                    {value &&
                      !isToday(value) &&
                      !isTomorrow(value) &&
                      formatDistanceToNowStrict(value, {
                        addSuffix: true,
                        unit: "day",
                      })}
                  </div>
                }
              >
                <>
                  <DatePicker value={value} onChange={onChange} />
                </>
              </Popover>
            </div>
          );
        },
      },
      {
        Header: "Priority",
        accessor: "priority",
        disableFilters: true,
        Cell: ({
          row: {
            original: { id },
          },
        }: CellProps<any>) => <PriorityPopover taskId={id} />,
      },
      {
        id: "actions",
        Cell: ({ row }: CellProps<any>) => (
          <DotsHorizontalIcon className="cursor-pointer h-5 w-5 text-gray-100" />
        ),
      },
    ],
    [taskStore]
  );

  return (
    <div className="p-4" ref={outerRef}>
      <TaskMenu outerRef={outerRef} />
      {taskStatusStore.statuses.length === 0 && (
        <div>
          <AddTaskStatusForm>"No statuses, create first."</AddTaskStatusForm>
        </div>
      )}
      {taskStatusStore.statuses.map((status: string) => {
        const tasks = groupedTasksByStatus()[status] || [];
        const statusId = taskStatusStore.items.find(
          (statusObj) => statusObj.name === status
        )?.id;
        const statusColor = taskStatusStore.items.find(
          (statusObj) => statusObj.name === status
        )?.color;

        if (!statusId) return "Cтатус не найден";
        return (
          <div className="mb-4" key={status}>
            <div className="flex flex-row">
              <div
                style={{ backgroundColor: statusColor }}
                className={`${getIdealTextColor(
                  statusColor
                )} gap-1 items-center inline-flex p-2 font-medium  rounded-t text-xs tracking-wider uppercase bg-green-500 text-white`}
              >
                <div>{status}</div>

                <div>
                  <AddTaskStatusForm>
                    <FolderAddIcon className="w-4 h-4" />
                  </AddTaskStatusForm>
                </div>
              </div>
            </div>
            <Table columns={columns} data={tasks} />
            <AddTaskForm statusId={statusId} />
            <div className="text-xs text-gray-500 mt-1 ml-3">+ New task</div>
          </div>
        );
      })}
    </div>
  );
});
