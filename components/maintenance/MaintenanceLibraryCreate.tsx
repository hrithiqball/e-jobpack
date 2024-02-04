import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  MaintenanceLibraryItem,
  MaintenanceLibraryList,
} from '@/types/maintenance';
import { TaskLibraryItem, TaskLibraryList } from '@/types/task';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type MaintenanceLibraryCreateProps = {
  maintenanceLibraryList: MaintenanceLibraryList;
  taskLibraryList: TaskLibraryList;
};
// FATAL MAJOR SHIT
export default function MaintenanceLibraryCreate({
  maintenanceLibraryList,
  taskLibraryList,
}: MaintenanceLibraryCreateProps) {
  const router = useRouter();
  const sensors = useSensors(useSensor(PointerSensor));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTask, setActiveTask] = useState<TaskLibraryItem | null>(null);

  function onDragEnd(event: DragEndEvent) {
    console.log('Dropped item:', event.active.id); // Log the id of the dragged item
    console.log('Dropped on:', event.over?.id); // Log the id of the droppable area
  }

  function onDragStart(event: DragStartEvent) {
    if (
      event.active.data.current &&
      event.active.data.current?.type === 'Task'
    ) {
      setActiveTask(event.active.data.current.task as TaskLibraryItem);
      return;
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div>
        <button
          onClick={() => router.push('/maintenance?tab=library&create=false')}
        >
          back
        </button>
        <div className="flex">
          {maintenanceLibraryList.map(library => (
            <div key={library.id} className="">
              {library.title}
              <div className="">
                <SortableContext items={library.checklistLibrary}>
                  {library.checklistLibrary.map(checklist => (
                    <ColumnContainer
                      key={checklist.id}
                      taskList={checklist.taskLibrary}
                      checklist={checklist}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>
          ))}
          <div className="flex flex-col">
            <SortableContext items={taskLibraryList}>
              {taskLibraryList.map(library => (
                <div key={library.id} className="bg-slate-800">
                  {library.taskActivity}
                </div>
              ))}
            </SortableContext>
          </div>
        </div>
      </div>
    </DndContext>
  );
}

// function ColumnContainer2() {

// }

function ColumnContainer({
  taskList,
  checklist,
}: {
  taskList: TaskLibraryList;
  checklist: MaintenanceLibraryItem['checklistLibrary'][0];
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: checklist.id,
    data: {
      type: 'Checklist',
      checklist,
    },
  });

  const taskIds = useMemo(() => {
    return taskList.map(task => task.id);
  }, [taskList]);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className=" bg-columnBackgroundColor flex h-[500px] max-h-[500px] w-[350px] flex-col rounded-md border-2 border-pink-500 opacity-40 "
      ></div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="">
      <div className="" {...attributes} {...listeners}></div>
      {checklist.title}
      <SortableContext items={taskIds}>
        {taskList.map(task => (
          <TaskContainer key={task.id} task={task} />
          // <div key={task.id} className="bg-blue-200">
          //   {task.taskActivity}
          // </div>
        ))}
      </SortableContext>
    </div>
  );
}

function TaskContainer({ task }: { task: TaskLibraryItem }) {
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
        className="bg-mainBackgroundColor relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl border-2 border-rose-500 p-2.5  text-left opacity-30"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className=""
    >
      <p>{task.taskActivity}</p>
    </div>
  );
}
