import {
  ADMIN_COMMENT_ROWS,
  COMMENT_STATUS,
  filterCommentsByStatus,
  getCommentPageNumbers,
  paginateComments,
  updateCommentStatus,
} from '@/portals/admin/data/adminCommentData';

describe('adminCommentData helpers', () => {
  it('filters comments by status without mutating source', () => {
    const sourceLength = ADMIN_COMMENT_ROWS.length;
    const approved = filterCommentsByStatus(ADMIN_COMMENT_ROWS, COMMENT_STATUS.APPROVED);
    const pending = filterCommentsByStatus(ADMIN_COMMENT_ROWS, COMMENT_STATUS.PENDING);
    const deleted = filterCommentsByStatus(ADMIN_COMMENT_ROWS, COMMENT_STATUS.DELETED);
    const hidden = filterCommentsByStatus(ADMIN_COMMENT_ROWS, COMMENT_STATUS.HIDDEN);

    expect(approved).toHaveLength(6);
    expect(pending).toHaveLength(2);
    expect(deleted).toHaveLength(2);
    expect(hidden).toHaveLength(2);
    expect(filterCommentsByStatus(ADMIN_COMMENT_ROWS, 'all')).toHaveLength(sourceLength);
    expect(ADMIN_COMMENT_ROWS).toHaveLength(sourceLength);
  });

  it('paginates comment rows', () => {
    const pageOne = paginateComments(ADMIN_COMMENT_ROWS, 1, 5);
    const pageTwo = paginateComments(ADMIN_COMMENT_ROWS, 2, 5);

    expect(pageOne).toHaveLength(5);
    expect(pageOne[0].id).toBe('cmt-0001');
    expect(pageTwo[0].id).toBe('cmt-0006');
  });

  it('builds a window of page numbers', () => {
    expect(getCommentPageNumbers(1, 3)).toEqual([1, 2, 3]);
    expect(getCommentPageNumbers(2, 5)).toEqual([1, 2, 3]);
    expect(getCommentPageNumbers(5, 5)).toEqual([3, 4, 5]);
  });

  it('updates a row status immutably', () => {
    const next = updateCommentStatus(ADMIN_COMMENT_ROWS, 'cmt-0004', COMMENT_STATUS.APPROVED);
    expect(next.find((row) => row.id === 'cmt-0004')?.status).toBe(COMMENT_STATUS.APPROVED);
    expect(ADMIN_COMMENT_ROWS.find((row) => row.id === 'cmt-0004')?.status).toBe(
      COMMENT_STATUS.PENDING,
    );
  });
});
