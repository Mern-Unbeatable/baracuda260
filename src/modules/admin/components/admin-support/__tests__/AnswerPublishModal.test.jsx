import React from 'react';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import AdminSupportContent from '@/modules/admin/views/AdminSupportContent';
import AnswerPublishModal from '@/modules/admin/components/admin-support/AnswerPublishModal';
import { ANSWER_MODAL_MODE } from '@/modules/admin/data/adminSupportData';

const sampleTicket = {
  id: 'pending-1',
  titleKey: 'adminSupport.tickets.export.title',
  previewKey: 'adminSupport.tickets.export.preview',
  fullQuestionKey: 'adminSupport.tickets.export.fullQuestion',
  timeKey: 'adminSupport.tickets.export.time',
  status: 'pending',
  answer: '',
};

const answeredTicket = {
  ...sampleTicket,
  id: 'answered-1',
  status: 'answered',
  answerKey: 'adminSupport.tickets.export.answer',
};

describe('AnswerPublishModal', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders compose mode with question, editor, and publish action', () => {
    const onClose = jest.fn();
    const onPublish = jest.fn();

    render(
      <AnswerPublishModal
        open
        mode={ANSWER_MODAL_MODE.COMPOSE}
        ticket={sampleTicket}
        onClose={onClose}
        onPublish={onPublish}
      />,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: i18n.t('adminSupport.modal.title') })).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminSupport.modal.originalQuestion'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminSupport.tickets.export.fullQuestion'), { exact: false })).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t('adminSupport.modal.answerLabel'))).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: i18n.t('adminSupport.modal.publish') }),
    ).toBeInTheDocument();
  });

  it('requires answer text before publishing', async () => {
    const user = userEvent.setup();
    const onPublish = jest.fn();

    render(
      <AnswerPublishModal
        open
        mode={ANSWER_MODAL_MODE.COMPOSE}
        ticket={sampleTicket}
        onClose={jest.fn()}
        onPublish={onPublish}
      />,
    );

    await user.click(screen.getByRole('button', { name: i18n.t('adminSupport.modal.publish') }));
    expect(onPublish).not.toHaveBeenCalled();
    expect(screen.getByText(i18n.t('adminSupport.modal.answerRequired'))).toBeInTheDocument();
  });

  it('publishes a composed answer', async () => {
    const user = userEvent.setup();
    const onPublish = jest.fn();

    render(
      <AnswerPublishModal
        open
        mode={ANSWER_MODAL_MODE.COMPOSE}
        ticket={sampleTicket}
        onClose={jest.fn()}
        onPublish={onPublish}
      />,
    );

    await user.type(
      screen.getByLabelText(i18n.t('adminSupport.modal.answerLabel')),
      'Refresh then export',
    );
    await user.click(screen.getByRole('button', { name: i18n.t('adminSupport.modal.publish') }));
    expect(onPublish).toHaveBeenCalledWith('Refresh then export');
  });

  it('renders published mode with answer and back action', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <AnswerPublishModal
        open
        mode={ANSWER_MODAL_MODE.PUBLISHED}
        ticket={answeredTicket}
        onClose={onClose}
        onPublish={jest.fn()}
      />,
    );

    expect(
      screen.getByText(i18n.t('adminSupport.tickets.export.answer'), { exact: false }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: i18n.t('adminSupport.modal.backToSupport') }));
    expect(onClose).toHaveBeenCalled();
  });

  it('switches modal copy to Polish', async () => {
    render(
      <AnswerPublishModal
        open
        mode={ANSWER_MODAL_MODE.COMPOSE}
        ticket={sampleTicket}
        onClose={jest.fn()}
        onPublish={jest.fn()}
      />,
    );

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(
      screen.getByRole('heading', { level: 2, name: 'Odpowiedz i opublikuj pytanie' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Oryginalne pytanie konsultanta')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Opublikuj i powiadom' })).toBeInTheDocument();
  });
});

describe('Admin Support content with Answer & Publish modal', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('opens compose modal from Answer and published modal from View Message', async () => {
    const user = userEvent.setup();
    render(<AdminSupportContent />);

    await user.click(screen.getAllByRole('button', { name: i18n.t('adminSupport.actions.answer') })[0]);
    const composeDialog = screen.getByRole('dialog');
    expect(
      within(composeDialog).getByRole('button', { name: i18n.t('adminSupport.modal.publish') }),
    ).toBeInTheDocument();

    await user.click(within(composeDialog).getByRole('button', { name: i18n.t('adminSupport.modal.close') }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(
      screen.getAllByRole('button', { name: i18n.t('adminSupport.actions.viewMessage') })[0],
    );
    const publishedDialog = screen.getByRole('dialog');
    expect(
      within(publishedDialog).getByRole('button', {
        name: i18n.t('adminSupport.modal.backToSupport'),
      }),
    ).toBeInTheDocument();
  });

  it('publishes from compose and moves the ticket to answered', async () => {
    const user = userEvent.setup();
    render(<AdminSupportContent />);

    expect(screen.getAllByRole('button', { name: i18n.t('adminSupport.actions.answer') })).toHaveLength(
      3,
    );

    await user.click(screen.getAllByRole('button', { name: i18n.t('adminSupport.actions.answer') })[0]);
    await user.type(
      screen.getByLabelText(i18n.t('adminSupport.modal.answerLabel')),
      'Use Export data on the dashboard',
    );
    await user.click(screen.getByRole('button', { name: i18n.t('adminSupport.modal.publish') }));

    expect(
      screen.getByRole('button', { name: i18n.t('adminSupport.modal.backToSupport') }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Use Export data on the dashboard', { exact: false }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: i18n.t('adminSupport.modal.backToSupport') }));
    expect(screen.getAllByRole('button', { name: i18n.t('adminSupport.actions.answer') })).toHaveLength(
      2,
    );
    expect(screen.getAllByText(i18n.t('adminSupport.actions.answered')).length).toBe(3);
  });
});
