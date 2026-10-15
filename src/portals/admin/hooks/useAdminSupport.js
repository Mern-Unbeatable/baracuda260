import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  ADMIN_SUPPORT_TICKETS,
  ANSWER_MODAL_MODE,
  filterSupportTicketsByStatus,
  findSupportTicketById,
  SUPPORT_STATUS,
} from '@/portals/admin/data/adminSupportData';
import {
  ADMIN_SUPPORT_QUERY_KEY,
  getAnsweredSupportTicketsApi,
  getPendingSupportTicketsApi,
  getSupportTicketDetailsApi,
  replySupportTicketApi,
} from '@/shared/api/support.api';
import { getApiErrorMessage } from '@/shared/api/client';

/**
 * Queues + Answer & Publish modal state for Admin Support connected to live API.
 */
export default function useAdminSupport() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [activeTicketId, setActiveTicketId] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [localAnswerOverride, setLocalAnswerOverride] = useState({});

  // 1. Pending tickets query
  const pendingQuery = useQuery({
    queryKey: [...ADMIN_SUPPORT_QUERY_KEY, 'pending'],
    queryFn: () => getPendingSupportTicketsApi(),
    staleTime: 30 * 1000,
  });

  // 2. Answered tickets query
  const answeredQuery = useQuery({
    queryKey: [...ADMIN_SUPPORT_QUERY_KEY, 'answered'],
    queryFn: () => getAnsweredSupportTicketsApi(),
    staleTime: 30 * 1000,
  });

  // 3. Active ticket detail query
  const detailQuery = useQuery({
    queryKey: [...ADMIN_SUPPORT_QUERY_KEY, 'detail', activeTicketId],
    queryFn: () => getSupportTicketDetailsApi(activeTicketId),
    enabled: Boolean(activeTicketId),
    staleTime: 30 * 1000,
  });

  // Fallbacks if backend has no records or error
  const fallbackPending = filterSupportTicketsByStatus(
    ADMIN_SUPPORT_TICKETS,
    SUPPORT_STATUS.PENDING,
  );
  const fallbackAnswered = filterSupportTicketsByStatus(
    ADMIN_SUPPORT_TICKETS,
    SUPPORT_STATUS.ANSWERED,
  );

  const pendingTickets =
    pendingQuery.data?.items !== undefined
      ? pendingQuery.data.items
      : pendingQuery.isLoading
        ? []
        : fallbackPending;

  const answeredTickets =
    answeredQuery.data?.items !== undefined
      ? answeredQuery.data.items
      : answeredQuery.isLoading
        ? []
        : fallbackAnswered;

  // Resolve active ticket
  const baseActiveTicket =
    detailQuery.data ||
    findSupportTicketById(pendingTickets, activeTicketId) ||
    findSupportTicketById(answeredTickets, activeTicketId) ||
    findSupportTicketById(ADMIN_SUPPORT_TICKETS, activeTicketId);

  const activeTicket = baseActiveTicket
    ? {
        ...baseActiveTicket,
        answer: localAnswerOverride[activeTicketId] || baseActiveTicket.answer,
      }
    : null;

  // 4. Reply mutation
  const replyMutation = useMutation({
    mutationFn: ({ ticketId, answer }) =>
      replySupportTicketApi({ ticketId, answer }),
    onSuccess: (_, variables) => {
      setLocalAnswerOverride((prev) => ({
        ...prev,
        [variables.ticketId]: variables.answer,
      }));
      queryClient.invalidateQueries({
        queryKey: ADMIN_SUPPORT_QUERY_KEY,
      });
      setModalMode(ANSWER_MODAL_MODE.PUBLISHED);
      toast.success(
        t('adminSupport.publishedSuccess', 'Reply published successfully!'),
      );
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('adminSupport.publishFailed', 'Failed to publish reply.'),
        ),
      );
    },
  });

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

  const handlePublish = async (answer) => {
    if (!activeTicketId) return;
    try {
      await replyMutation.mutateAsync({
        ticketId: activeTicketId,
        answer,
      });
    } catch {
      // Handled in onError
    }
  };

  return {
    pendingTickets,
    answeredTickets,
    activeTicket,
    modalMode,
    isModalOpen: Boolean(modalMode && (activeTicket || activeTicketId)),
    isLoading: pendingQuery.isLoading || answeredQuery.isLoading,
    isPendingLoading: pendingQuery.isLoading,
    isAnsweredLoading: answeredQuery.isLoading,
    isDetailLoading: detailQuery.isLoading,
    isSubmitting: replyMutation.isPending,
    handleOpenCompose,
    handleOpenPublished,
    handleCloseModal,
    handlePublish,
    refetchPending: pendingQuery.refetch,
    refetchAnswered: answeredQuery.refetch,
  };
}
