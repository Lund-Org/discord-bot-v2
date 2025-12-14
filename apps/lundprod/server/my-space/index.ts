import { TServer } from '../types';
import { addBacklogItemProcedure } from './add-backlog-item.procedure';
import { addExpectedGameProcedure } from './add-expected-game.procedure';
import { changeBacklogItemStatusProcedure } from './change-backlog-item-status.procedure';
import { moveBacklogItemProcedure } from './move-backlog-item.procedure';
import { moveBacklogItemToPositionProcedure } from './move-backlog-item-to-position.procedure';
import { removeBacklogItemProcedure } from './remove-backlog-item.procedure';
import { removeExpectedGameProcedure } from './remove-expected-game.procedure';
import { sortMyBacklogProcedure } from './sort-my-backlog.procedure';
import { toggleExpectedGameBacklogProcedure } from './toggle-expected-game-backlog.procedure';
import { updateBacklogItemNoteProcedure } from './update-backlog-item-note.procedure';
import { upsertReviewProcedure } from './upsert-review.procedure';

export function getMySpaceRouter(t: TServer) {
  return {
    addBacklogItem: addBacklogItemProcedure(t),
    addExpectedGame: addExpectedGameProcedure(t),
    changeBacklogItemStatus: changeBacklogItemStatusProcedure(t),
    moveBacklogItem: moveBacklogItemProcedure(t),
    moveBacklogItemToPosition: moveBacklogItemToPositionProcedure(t),
    removeBacklogItem: removeBacklogItemProcedure(t),
    removeExpectedGame: removeExpectedGameProcedure(t),
    sortMyBacklog: sortMyBacklogProcedure(t),
    toggleExpectedGameBacklog: toggleExpectedGameBacklogProcedure(t),
    updateBacklogItemNote: updateBacklogItemNoteProcedure(t),
    upsertReview: upsertReviewProcedure(t),
  };
}
