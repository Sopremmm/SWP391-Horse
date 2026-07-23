import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import RefereeRaceDetail from './RefereeRaceDetail.tsx';

jest.mock('react-router-dom', () => ({
  useParams: () => ({}),
  Link: ({ children }: { children: React.ReactNode }) => <a href="#test">{children}</a>,
  NavLink: ({ children }: { children: React.ReactNode }) => <a href="#test">{children}</a>,
}), { virtual: true });

test('submits the referee report only after confirmation', async () => {
  const onSubmit = jest.fn().mockResolvedValue(undefined);

  render(
    <RefereeRaceDetail
      data={{
        raceName: 'Round 1',
        participants: [{ gate: '1', horse: 'Thunder', breed: 'Thoroughbred', jockey: 'Demo Jockey' }],
      }}
      onSubmit={onSubmit}
    />,
  );

  fireEvent.click(screen.getByText('Submit to Admin'));
  fireEvent.click(screen.getByText('Confirm Submit'));

  await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
});

test('does not mark an untouched attendance checkbox as an absence', async () => {
  const onSaveParticipants = jest.fn().mockResolvedValue(undefined);

  render(
    <RefereeRaceDetail
      data={{
        raceName: 'Round 1',
        participants: [{ entryId: 10, gate: '1', horse: 'Lightning', breed: 'Arabian', jockey: 'Demo Jockey', checkedIn: false }],
      }}
      onSaveParticipants={onSaveParticipants}
    />,
  );

  fireEvent.click(screen.getByText('Save Table'));

  await waitFor(() => expect(onSaveParticipants).toHaveBeenCalledTimes(1));
  expect(onSaveParticipants.mock.calls[0][0][0]).toMatchObject({ checkedIn: false });
  expect(onSaveParticipants.mock.calls[0][0][0]).not.toHaveProperty('attendanceTouched');
});
