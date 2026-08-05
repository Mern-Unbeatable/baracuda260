import {
  ADMIN_SUPPORT_TICKETS,
  SUPPORT_STATUS,
  applyEditorTool,
  filterSupportTicketsByStatus,
  findSupportTicketById,
  getTicketAnswerText,
  markSupportTicketAnswered,
  publishSupportAnswer,
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

  it('publishes an answer without mutating source tickets', () => {
    const source = ADMIN_SUPPORT_TICKETS;
    const next = publishSupportAnswer(source, 'pending-1', '  Refresh and export  ');

    expect(next).not.toBe(source);
    expect(findSupportTicketById(next, 'pending-1')).toMatchObject({
      status: SUPPORT_STATUS.ANSWERED,
      answer: 'Refresh and export',
    });
    expect(findSupportTicketById(source, 'pending-1')?.status).toBe(SUPPORT_STATUS.PENDING);
    expect(filterSupportTicketsByStatus(next, SUPPORT_STATUS.PENDING)).toHaveLength(2);
    expect(filterSupportTicketsByStatus(next, SUPPORT_STATUS.ANSWERED)).toHaveLength(3);
  });

  it('keeps markSupportTicketAnswered as a publish helper alias', () => {
    const next = markSupportTicketAnswered(ADMIN_SUPPORT_TICKETS, 'pending-2');
    expect(findSupportTicketById(next, 'pending-2')?.status).toBe(SUPPORT_STATUS.ANSWERED);
  });

  it('applies toolbar wrap and prefix tools to a selection', () => {
    const wrapped = applyEditorTool('hello world', { start: 6, end: 11 }, { wrap: ['**', '**'] });
    expect(wrapped.value).toBe('hello **world**');
    expect(wrapped.selection).toEqual({ start: 8, end: 13 });

    const listed = applyEditorTool('item', { start: 0, end: 4 }, { prefix: '- ' });
    expect(listed.value).toBe('- item');
  });

  it('resolves ticket answer text from answer or answerKey', () => {
    const t = (key) => (key === 'adminSupport.tickets.export.answer' ? 'Stored answer' : key);
    expect(getTicketAnswerText({ answer: 'Live answer' }, t)).toBe('Live answer');
    expect(getTicketAnswerText({ answerKey: 'adminSupport.tickets.export.answer' }, t)).toBe(
      'Stored answer',
    );
  });
});
