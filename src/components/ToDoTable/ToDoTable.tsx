import { PlayIcon, FlagIcon } from "@heroicons/react/solid";
import {
  CalendarIcon,
  ClockIcon,
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
import { Popover } from "../Popover";
import { TimeInput } from "../TimeInput/TimeInput";
import { TimerCell } from "../TimerCell/TimerCell";
import { UsersPopover } from "../UsersPopover/UsersPopover";
import { TimeEstimateCell } from "../TimeEstimateCell";

type GropedTasks = {
  [key: string]: Task[] | any;
};

export const ToDoTable = observer(() => {
  const {
    task: taskStore,
    taskStatus: taskStatusStore,
    list: listStore,
  } = useStore();

  const groupedTasksByStatus = taskStore.parents
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
          subRows: task?.subTasks,
        })),
      });
      return acc;
    }, {});

  const columns = [
    {
      // Build our expander column
      id: "expander", // Make sure it has an ID
      // Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }: any) => (
      //   <span {...getToggleAllRowsExpandedProps()}>
      //     {isAllRowsExpanded ? '👇' : }
      //   </span>
      // ),
      Cell: ({ row }: CellProps<any>) =>
        // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
        // to build the toggle for expanding a row
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
      Cell: ({ row, value }: CellProps<Task>) => (
        <div className="flex flex-row items-center font-semibold text-gray-700">
          <div>{value}</div>
          <div className="ml-1" />
          <div>
            <Modal
              title={`Add task ${`to ${row.original.name}`}`}
              clickComponent={
                <ViewGridAddIcon className="w-3 h-3 text-gray-400 cursor-pointer" />
              }
            >
              <AddTaskForm
                statusId={row.original.status.id}
                parentId={row.original.id}
              />
            </Modal>
          </div>
        </div>
      ),
    },
    {
      Header: "Time estimate",
      accessor: "timeEstimate",
      disableFilters: true,
      Cell: ({ value, row: { original: { id } } }: CellProps<Task>) => (
        <TimeEstimateCell taskId={id} value={value} />
      ),
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
      Cell: ({ value }: CellProps<any>) => (
        <div className="flex">
          <CalendarIcon className="w-4 h-4 text-gray-400" /> {value || ""}
        </div>
      ),
    },
    {
      Header: "Priority",
      accessor: "priority",
      disableFilters: true,
      Cell: ({ value }: CellProps<any>) => (
        <div className="flex">
          <FlagIcon className="w-4 h-4 text-gray-400" />
        </div>
      ),
    },
    {
      id: "actions",
      Cell: ({ row }: CellProps<any>) => (
        <DotsHorizontalIcon className="cursor-pointer h-5 w-5 text-gray-100" />
      ),
    },
  ];

  return (
    <div className="p-4">
      {taskStatusStore.statuses.length === 0 && (
        <div>
          <AddTaskStatusForm>"No statuses, create first."</AddTaskStatusForm>
        </div>
      )}
      {taskStatusStore.statuses.map((status: string) => {
        const tasks = groupedTasksByStatus[status];
        const statusId = taskStatusStore.items.find(
          (statusObj) => statusObj.name === status
        )?.id;
        const statusColor = taskStatusStore.items.find(
          (statusObj) => statusObj.name === status
        )?.color;

        if (!statusId) return "Cтатус не найден";
        return (
          <div className="mb-4">
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
            <Table columns={columns} data={tasks ? [...tasks] : []} />
            <AddTaskForm statusId={statusId} />
            <div className="text-xs text-gray-500 mt-1 ml-3">+ New task</div>
          </div>
        );
      })}
    </div>
  );
});
