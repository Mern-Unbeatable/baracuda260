import { useState } from 'react';
import {
  ADMIN_SUPPORT_TICKETS,
  SUPPORT_STATUS,
  filterSupportTicketsByStatus,
  markSupportTicketAnswered,
} from './adminSupportData';

/**
 * Pending / answered queues and ticket actions for Admin Support.
 */
export default function useAdminSupport(initialTickets = ADMIN_SUPPORT_TICKETS) {
  const [tickets, setTickets] = useState(initialTickets);
  const [viewedTicketId, setViewedTicketId] = useState(null);

  const pendingTickets = filterSupportTicketsByStatus(tickets, SUPPORT_STATUS.PENDING);
  const answeredTickets = filterSupportTicketsByStatus(tickets, SUPPORT_STATUS.ANSWERED);

  const handleAnswer = (ticketId) => {
    setTickets((current) => markSupportTicketAnswered(current, ticketId));
  };

  const handleViewMessage = (ticketId) => {
    setViewedTicketId(ticketId);
  };

  return {
    pendingTickets,
    answeredTickets,
    viewedTicketId,
    handleAnswer,
    handleViewMessage,
  };
}
