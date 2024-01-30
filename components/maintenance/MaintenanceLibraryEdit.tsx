import { Card } from '@nextui-org/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { MaintenanceLibraryItem } from '@/types/maintenance';
import { TaskLibraryList } from '@/types/task';
import { Fragment } from 'react';

interface MaintenanceLibraryEditProps {
  maintenanceLibrary: MaintenanceLibraryItem;
  taskLibraryList: TaskLibraryList;
}
// TODO: use tutorial to fix this issue
// WIP: https://codesandbox.io/p/sandbox/react-beautiful-dnd-board-base-0dv9b?file=%2Fsrc%2FApp.js%3A13%2C35
export default function MaintenanceLibraryEdit({
  maintenanceLibrary,
  taskLibraryList,
}: MaintenanceLibraryEditProps) {
  function handleDragEnd(result: any) {
    if (!result.destination) return;

    // Retrieve the dragged item and destination index
    const { source, destination } = result;

    // Implement logic to update your state or perform any other actions
    console.log(
      `Moved task from index ${source.index} to index ${destination.index}`,
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-1 space-x-4">
        <Card shadow="none" className="lg:w-3/4 p-4">
          <div className="flex flex-1 flex-col">
            {maintenanceLibrary.checklistLibrary.map(checklist => (
              <div key={checklist.id} className="">
                {checklist.title}
                {checklist.taskLibrary.length > 0 ? (
                  <Droppable droppableId={checklist.id} type="TASK">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className=""
                      >
                        {checklist.taskLibrary.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.dragHandleProps}
                                {...provided.draggableProps}
                                className=""
                              >
                                <Fragment>{task.taskActivity}</Fragment>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
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
            {/* {taskLibraryList.map(taskLibrary => (
              <div key={taskLibrary.id} className="">
                {taskLibrary.taskActivity}
              </div>
            ))} */}
            <Droppable droppableId="TASK_LIBRARY" type="TASK">
              {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {taskLibraryList.map((taskLibrary, index) => (
                    <Draggable
                      key={taskLibrary.id}
                      draggableId={taskLibrary.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className=""
                        >
                          {taskLibrary.taskActivity}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </Card>
      </div>
    </DragDropContext>
  );
}
