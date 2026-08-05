import {
  ADMIN_SUPPORT_TICKETS,
  SUPPORT_STATUS,
  filterSupportTicketsByStatus,
  markSupportTicketAnswered,
} from '../adminSupportData';

describe('adminSupportData helpers', () => {
  it('filters tickets by pending and answered status', () => {
    const pending = filterSupportTicketsByStatus(ADMIN_SUPPORT_TICKETS, SUPPORT_STATUS.PENDING);
    const answered = filterSupportTicketsByStatus(ADMIN_SUPPORT_TICKETS, SUPPORT_STATUS.ANSWERED);

    expect(pending).toHaveLength(3);
    expect(answered).toHaveLength(2);
    expect(pending.every((ticket) => ticket.status === SUPPORT_STATUS.PENDING)).toBe(true);
    expect(answered.every((ticket) => ticket.status === SUPPORT_STATUS.ANSWERED)).toBe(true);
  });

  it('marks a pending ticket as answered without mutating source', () => {
    const source = ADMIN_SUPPORT_TICKETS;
    const next = markSupportTicketAnswered(source, 'pending-1');

    expect(next).not.toBe(source);
    expect(next.find((ticket) => ticket.id === 'pending-1')?.status).toBe(SUPPORT_STATUS.ANSWERED);
    expect(source.find((ticket) => ticket.id === 'pending-1')?.status).toBe(SUPPORT_STATUS.PENDING);
    expect(filterSupportTicketsByStatus(next, SUPPORT_STATUS.PENDING)).toHaveLength(2);
    expect(filterSupportTicketsByStatus(next, SUPPORT_STATUS.ANSWERED)).toHaveLength(3);
  });
});
