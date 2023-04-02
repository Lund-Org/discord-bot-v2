import { DragHandleIcon } from '@chakra-ui/icons';
import { Td,Tr } from '@chakra-ui/react';
import { ReactNode, useEffect, useState } from 'react';
import {
  Draggable,
  DraggableProvidedDraggableProps,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';

import { BacklogItemLight } from '~/lundprod/contexts/backlog-context';

type DraggableRowProps = {
  item: BacklogItemLight;
  isReadOnly: boolean;
  isFiltered: boolean;
  children: ReactNode;
};

export const DraggableRow = ({
  children,
  item,
  isReadOnly,
  isFiltered,
}: DraggableRowProps) => {
  const [backlogId, setBacklogId] = useState<number | null>(null);

  useEffect(() => {
    const unselect = () => {
      setBacklogId(null);
    };

    window.addEventListener('mouseup', unselect);

    return () => {
      window.removeEventListener('mouseup', unselect);
    };
  }, []);

  if (isReadOnly || isFiltered) {
    return <Tr>{children}</Tr>;
  }

  return (
    <Draggable
      key={item.igdbGameId}
      draggableId={item.igdbGameId.toString()}
      index={item.order}
    >
      {(provided, snapshot) => (
        <Tr
          ref={provided.innerRef}
          tabIndex={0}
          {...provided.draggableProps}
          style={getDraggableStyle(provided.draggableProps.style, snapshot)}
          bg={item.igdbGameId === backlogId ? 'gray.900' : 'gray.800'}
        >
          <Td
            w={10}
            onMouseDown={() => setBacklogId(item.igdbGameId)}
            onKeyDown={(e) => {
              if (e.code === 'Enter' || e.code === 'Space') {
                setBacklogId(backlogId ? null : item.igdbGameId);
              }
              e.stopPropagation();
            }}
          >
            <div {...provided.dragHandleProps}>
              <DragHandleIcon color="gray.600" _hover={{ color: 'gray.300' }} />
            </div>
          </Td>
          {children}
        </Tr>
      )}
    </Draggable>
  );
};

function getDraggableStyle(
  style: DraggableProvidedDraggableProps['style'],
  snapshot: DraggableStateSnapshot
) {
  if (!snapshot.isDropAnimating && !snapshot.isDragging) {
    return style;
  }

  const boxShadowColor = snapshot.isDropAnimating
    ? 'var(--chakra-colors-gray-200)'
    : 'var(--chakra-colors-blue-500)';
  const computedStyle = {
    ...style,
    // Table and tableLayout are set in order for the dragged row to keep the same size as the others still in the table
    display: 'table',
    tableLayout: 'fixed' as const,
    transition: `${style?.transition}, box-shadow .35s`,
    boxShadow: `inset 0 -1px ${boxShadowColor}`,
  };
  return computedStyle;
}
