import { useState } from 'react';
import {
  ADMIN_SUPPORT_TICKETS,
  ANSWER_MODAL_MODE,
  SUPPORT_STATUS,
  filterSupportTicketsByStatus,
  findSupportTicketById,
  publishSupportAnswer,
} from '@/portals/admin/data/adminSupportData';

/**
 * Queues + Answer & Publish modal state for Admin Support.
 */
export default function useAdminSupport(initialTickets = ADMIN_SUPPORT_TICKETS) {
  const [tickets, setTickets] = useState(initialTickets);
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [modalMode, setModalMode] = useState(null);

  const pendingTickets = filterSupportTicketsByStatus(tickets, SUPPORT_STATUS.PENDING);
  const answeredTickets = filterSupportTicketsByStatus(tickets, SUPPORT_STATUS.ANSWERED);
  const activeTicket = findSupportTicketById(tickets, activeTicketId);

  const handleOpenCompose = (ticketId) => {
    setActiveTicketId(ticketId);
    setModalMode(ANSWER_MODAL_MODE.COMPOSE);
  };

  const handleOpenPublished = (ticketId) => {
    setActiveTicketId(ticketId);
    setModalMode(ANSWER_MODAL_MODE.PUBLISHED);
  };

  const handleCloseModal = () => {
    setActiveTicketId(null);
    setModalMode(null);
  };

  const handlePublish = (answer) => {
    if (!activeTicketId) return;
    setTickets((current) => publishSupportAnswer(current, activeTicketId, answer));
    setModalMode(ANSWER_MODAL_MODE.PUBLISHED);
  };

  return {
    pendingTickets,
    answeredTickets,
    activeTicket,
    modalMode,
    isModalOpen: Boolean(modalMode && activeTicket),
    handleOpenCompose,
    handleOpenPublished,
    handleCloseModal,
    handlePublish,
  };
}
