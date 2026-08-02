import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';

import { Button } from './button';

jest.mock('lucide-react-native', () => ({ ArrowRight: () => null }));

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(),
  notificationAsync: jest.fn(),
  impactAsync: jest.fn(),
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
  ImpactFeedbackStyle: { Medium: 'medium' },
}));

describe('Button', () => {
  it('renders its title', async () => {
    const { getByText } = await render(
      <Button title="Save" onPress={() => {}} />,
    );
    expect(getByText('Save')).toBeTruthy();
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(
      <Button title="Save" onPress={onPress} />,
    );
    fireEvent.press(getByText('Save'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(
      <Button title="Save" onPress={onPress} disabled />,
    );
    fireEvent.press(getByText('Save'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('blocks presses while loading', async () => {
    const onPress = jest.fn();
    const { getByRole, queryByText } = await render(
      <Button title="Save" onPress={onPress} loading />,
    );
    expect(queryByText('Save')).toBeNull();
    fireEvent.press(getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
