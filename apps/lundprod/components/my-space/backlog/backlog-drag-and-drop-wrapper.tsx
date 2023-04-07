import { Tbody } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import { useBacklog } from '~/lundprod/contexts/backlog-context';

import { StrictModeDroppable } from '../../helpers/strict-mode-droppable';

type DragAndDropWrapperProps = {
  children: ReactNode;
  isReadOnly: boolean;
  isFiltered: boolean;
};

export const DragAndDropWrapper = ({
  children,
  isReadOnly,
  isFiltered,
}: DragAndDropWrapperProps) => {
  const { onReorder } = useBacklog();

  if (isReadOnly || isFiltered) {
    return <Tbody>{children}</Tbody>;
  }

  const onDragEnd = (result: DropResult) => {
    if (
      !result.destination ||
      result.source.index === result.destination.index
    ) {
      return;
    }

    onReorder({
      igdbId: +result.draggableId,
      oldOrder: result.source.index,
      newOrder: result.destination.index,
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="backlog-list">
        {(provided, { isDraggingOver }) => (
          <Tbody {...provided.droppableProps} ref={provided.innerRef}>
            {children}
            {provided.placeholder}
          </Tbody>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
};
