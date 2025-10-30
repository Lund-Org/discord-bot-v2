import { TServer } from '../types';
import { addBacklogItemProcedure } from './add-backlog-item.procedure';
import { changeBacklogItemStatusProcedure } from './change-backlog-item-status.procedure';
import { moveBacklogItemProcedureProcedure } from './move-backlog-item.procedure';
import { removeBacklogItemProcedure } from './remove-backlog-item.procedure';
import { sortMyBacklogProcedure } from './sort-my-backlog.procedure';
import { updateBacklogItemNoteProcedure } from './update-backlog-item-note.procedure';
import { upsertReviewProcedure } from './upsert-review.procedure';

export function getMySpaceRouter(t: TServer) {
  return {
    addBacklogItem: addBacklogItemProcedure(t),
    sortMyBacklog: sortMyBacklogProcedure(t),
    moveBacklogItem: moveBacklogItemProcedureProcedure(t),
    changeBacklogItemStatus: changeBacklogItemStatusProcedure(t),
    removeBacklogItem: removeBacklogItemProcedure(t),
    updateBacklogItemNote: updateBacklogItemNoteProcedure(t),
    upsertReview: upsertReviewProcedure(t),
  };
}
