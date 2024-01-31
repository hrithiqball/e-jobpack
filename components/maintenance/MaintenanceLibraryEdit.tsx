/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { useState, Fragment, useMemo } from 'react';

import { Card } from '@nextui-org/react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { MaintenanceLibraryItem } from '@/types/maintenance';
import { TaskLibraryItem, TaskLibraryList } from '@/types/task';
import { createPortal } from 'react-dom';
import { Plus, Trash } from 'lucide-react';

interface MaintenanceLibraryEditProps {
  maintenanceLibrary: MaintenanceLibraryItem;
  taskLibraryList: TaskLibraryList;
}
export default function MaintenanceLibraryEdit({
  maintenanceLibrary,
  taskLibraryList,
}: MaintenanceLibraryEditProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const [taskLibrary, setTaskLibrary] = useState(taskLibraryList);
  const [maintenanceLib, setMaintenanceLib] = useState(maintenanceLibrary);
  const [activeTask, setActiveTask] = useState<TaskLibraryItem | null>(null);
  const [tasks, setTasks] = useState<TaskLibraryList>(taskLibraryList);
  const defaultCols: MaintenanceLibraryItem['checklistLibrary'] =
    maintenanceLibrary.checklistLibrary;

  const [columns, setColumns] =
    useState<MaintenanceLibraryItem['checklistLibrary']>(defaultCols);
  const [activeColumn, setActiveColumn] = useState<
    MaintenanceLibraryItem['checklistLibrary'][0] | null
  >(null);
  const columnsId = useMemo(() => columns.map(col => col.id), [columns]);

  function deleteTask(id: string) {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id: string, content: string) {
    const newTasks = tasks.map(task => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }

  function onDragStart(event: DragStartEvent) {
    if (
      event.active.data.current &&
      event.active.data.current?.type === 'Column'
    ) {
      setActiveColumn(
        event.active.data.current
          .column as MaintenanceLibraryItem['checklistLibrary'][0],
      );
      return;
    }

    if (
      event.active.data.current &&
      event.active.data.current?.type === 'Task'
    ) {
      setActiveTask(event.active.data.current.task as TaskLibraryItem);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === 'Column';
    if (!isActiveAColumn) return;

    setColumns(columns => {
      const activeColumnIndex = columns.findIndex(col => col.id === activeId);

      const overColumnIndex = columns.findIndex(col => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  // function onDragOver(event: DragOverEvent) {
  //   const { active, over } = event;
  //   if (!over) return;

  //   const activeId = active.id;
  //   const overId = over.id;

  //   if (activeId === overId) return;

  //   const isActiveATask = active.data.current?.type === 'Task';
  //   const isOverATask = over.data.current?.type === 'Task';

  //   if (!isActiveATask) return;

  //   if (isActiveATask && isOverATask) {
  //     setTasks(tasks => {
  //       const activeIndex = tasks.findIndex(t => t.id === activeId);
  //       const overIndex = tasks.findIndex(t => t.id === overId);

  //       if (tasks[activeIndex]!.columnId != tasks[overIndex]!.columnId) {
  //         tasks[activeIndex]!.columnId = tasks[overIndex]!.columnId;
  //         return arrayMove(tasks, activeIndex, overIndex - 1);
  //       }

  //       return arrayMove(tasks, activeIndex, overIndex);
  //     });
  //   }

  //   const isOverAColumn = over.data.current?.type === 'Column';

  //   if (isActiveATask && isOverAColumn) {
  //     setTasks(tasks => {
  //       const activeIndex = tasks.findIndex(t => t.id === activeId);

  //       tasks[activeIndex]!.checklistLibraryId = overId;
  //       console.log('DROPPING TASK OVER COLUMN', { activeIndex });
  //       return arrayMove(tasks, activeIndex, activeIndex);
  //     });
  //   }
  // }

  return (
    <DndContext
      sensors={sensors}
      // onDragStart={handleDragStart}
      // onDragEnd={handleDragEnd}
      // onDragOver={handleDragOver}
    >
      <div className="flex flex-1 space-x-4">
        <Card shadow="none" className="lg:w-3/4 p-4">
          <div className="flex flex-1 flex-col">
            {maintenanceLib.checklistLibrary.map(checklist => (
              <div key={checklist.id} className="">
                {checklist.title}
                {checklist.taskLibrary.length > 0 ? (
                  <Fragment>
                    {checklist.taskLibrary.map(task => (
                      <Fragment key={task.id}>{task.taskActivity}</Fragment>
                    ))}
                  </Fragment>
                ) : (
                  <div className="flex justify-center items-center">
                    No tasks / Droppable zone
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
        <Card shadow="none" className="lg:w-1/4 p-4">
          <div className="flex flex-col">
            {taskLibrary.map(taskLib => (
              <div key={taskLib.id} className="">
                {taskLib.taskActivity}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DndContext>
    // <DndContext
    //   sensors={sensors}
    //   onDragStart={onDragStart}
    //   onDragEnd={onDragEnd}
    //   onDragOver={onDragOver}
    // >
    //   <div className="m-auto flex gap-4">
    //     <div className="flex gap-4">
    //       <SortableContext items={columnsId}>
    //         {columns.map(col => (
    //           <ColumnContainer
    //             key={col.id}
    //             column={col}
    //             deleteColumn={deleteColumn}
    //             updateColumn={updateColumn}
    //             createTask={createTask}
    //             deleteTask={deleteTask}
    //             updateTask={updateTask}
    //             tasks={col.taskLibrary}
    //           />
    //         ))}
    //       </SortableContext>
    //     </div>
    //   </div>

    //   {createPortal(
    //     <DragOverlay>
    //       {activeColumn && (
    //         <ColumnContainer
    //           column={activeColumn}
    //           deleteColumn={deleteColumn}
    //           updateColumn={updateColumn}
    //           createTask={createTask}
    //           deleteTask={deleteTask}
    //           updateTask={updateTask}
    //           tasks={taskLibraryList}
    //         />
    //       )}
    //       {activeTask && (
    //         <TaskCard
    //           task={activeTask}
    //           deleteTask={deleteTask}
    //           updateTask={updateTask}
    //         />
    //       )}
    //     </DragOverlay>,
    //     document.body,
    //   )}
    // </DndContext>
  );
}

const defaultTasks: Task[] = [
  {
    id: '1',
    columnId: 'todo',
    content: 'List admin APIs for dashboard',
  },
  {
    id: '2',
    columnId: 'todo',
    content:
      'Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation',
  },
  {
    id: '3',
    columnId: 'doing',
    content: 'Conduct security testing',
  },
  {
    id: '4',
    columnId: 'doing',
    content: 'Analyze competitors',
  },
  {
    id: '5',
    columnId: 'done',
    content: 'Create UI kit documentation',
  },
  {
    id: '6',
    columnId: 'done',
    content: 'Dev meeting',
  },
  {
    id: '7',
    columnId: 'done',
    content: 'Deliver dashboard prototype',
  },
  {
    id: '8',
    columnId: 'todo',
    content: 'Optimize application performance',
  },
  {
    id: '9',
    columnId: 'todo',
    content: 'Implement data validation',
  },
  {
    id: '10',
    columnId: 'todo',
    content: 'Design database schema',
  },
  {
    id: '11',
    columnId: 'todo',
    content: 'Integrate SSL web certificates into workflow',
  },
  {
    id: '12',
    columnId: 'doing',
    content: 'Implement error logging and monitoring',
  },
  {
    id: '13',
    columnId: 'doing',
    content: 'Design and implement responsive UI',
  },
];

type Task = {
  id: string;
  columnId: string | number;
  content: string;
};

function TaskCard({
  task,
  deleteTask,
  updateTask,
}: {
  task: TaskLibraryItem;
  deleteTask: (id: string) => void;
  updateTask: (id: string, content: string) => void;
}) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(true);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode(prev => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-rose-500  cursor-grab relative"
      />
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
      >
        <textarea
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
          value={task.taskActivity}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onKeyDown={e => {
            if (e.key === 'Enter' && e.shiftKey) {
              toggleEditMode();
            }
          }}
          onChange={e => updateTask(task.id, e.target.value)}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative task"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.taskActivity}
      </p>

      {mouseIsOver && (
        <button
          onClick={() => {
            deleteTask(task.id);
          }}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"
        >
          <Trash />
        </button>
      )}
    </div>
  );
}

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001).toString();
}

interface Props {
  column: MaintenanceLibraryItem['checklistLibrary'][0];
  deleteColumn: (id: string) => void;
  updateColumn: (id: string, title: string) => void;

  createTask: (columnId: string) => void;
  updateTask: (id: string, content: string) => void;
  deleteTask: (id: string) => void;
  tasks: TaskLibraryList;
}

function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}: Props) {
  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map(task => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className=" bg-columnBackgroundColor opacity-40 border-2 border-pink-500 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className=" bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col "
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className=" bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between "
      >
        <div className="flex gap-2">
          <div className=" flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full ">
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              value={column.title}
              onChange={e => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={e => {
                if (e.key !== 'Enter') return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => {
            deleteColumn(column.id);
          }}
          className=" stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2 "
        >
          <Trash />
        </button>
      </div>

      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      {/* Column footer */}
      <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <Plus />
        Add task
      </button>
    </div>
  );
}
