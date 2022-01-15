import React, { useEffect } from "react";
import { useStore } from "../../models/StoreContext";
import { useForm } from "react-hook-form";
import { CirclePicker } from "react-color";
import { useHandleClickOutside } from "../../hooks/useHandleClickOutside";

export const AddTaskStatusForm = ({ children }: any) => {
  const store = useStore();
  const [show, setShow] = React.useState(false);
  const [color, setColor] = React.useState("");
  const { register, handleSubmit, resetField } = useForm();

  const { ref: AddTaskStatusFormRef } = useHandleClickOutside(setShow);


  useEffect(() => {
    if (show) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [setShow, show]);

  const onSubmit = async ({ taskStatusName }: { taskStatusName: string }) => {
    resetField("taskStatusName");
    store.taskStatus.add({ name: taskStatusName, color });
    setShow(false)
  };
  const handleSelectColor = ({ hex }: { hex: string }) => {
    setColor(hex);
  };

  return (
    <div ref={AddTaskStatusFormRef}>
      <div onClick={() => setShow(true)}>
        {children}
      </div>
      <div className={`${show ? '' : 'invisible'} z-50 absolute mt-3 bg-white rounded-xl p-4 shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px]`}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center mb-5">
            <label className="flex-auto gap-1">
              <span className="text-base font-medium text-gray-700">New status:</span>
              <input
                {...register("taskStatusName", { required: true })}
                onClick={() => setShow(true)}
                className="border rounded-md p-1 w-full mt-1 text-base text-gray-700"
                autoComplete="off"
                style={{ borderColor: color }}
              />
            </label>
          </div>
          <div>
            <div className="mb-2" />
            <CirclePicker onChange={handleSelectColor} />
          </div>
        </form>
      </div>
    </div>
  );
};
