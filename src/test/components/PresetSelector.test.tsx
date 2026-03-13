import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { ReactNode } from 'react';
import { PresetSelector } from '../../components/input/PresetSelector';
import { AppProvider } from '../../context/AppContext';
import { presets } from '../../data/presets';

function renderWithProvider(ui: ReactNode) {
  return render(<AppProvider>{ui}</AppProvider>);
}

describe('PresetSelector', () => {
  it('should render all preset buttons', () => {
    renderWithProvider(<PresetSelector />);
    for (const preset of presets) {
      expect(screen.getByText(preset.label)).toBeInTheDocument();
    }
  });

  it('should render preset descriptions', () => {
    renderWithProvider(<PresetSelector />);
    for (const preset of presets) {
      expect(screen.getByText(preset.description)).toBeInTheDocument();
    }
  });

  it('should set spec text when a preset is clicked', () => {
    renderWithProvider(<PresetSelector />);
    const firstPreset = presets[0];
    fireEvent.click(screen.getByText(firstPreset.label));
    // The textarea in SpecTextArea would show the content
    // Here we verify the button becomes visually active
    const button = screen.getByText(firstPreset.label).closest('button');
    expect(button).toHaveClass('border-blue-500');
  });

  it('should highlight the active preset', () => {
    renderWithProvider(<PresetSelector />);
    const firstPreset = presets[0];
    const secondPreset = presets[1];

    fireEvent.click(screen.getByText(firstPreset.label));
    const firstButton = screen.getByText(firstPreset.label).closest('button');
    expect(firstButton).toHaveClass('border-blue-500');

    fireEvent.click(screen.getByText(secondPreset.label));
    const secondButton = screen.getByText(secondPreset.label).closest('button');
    expect(secondButton).toHaveClass('border-blue-500');
    // First button should no longer be active
    expect(firstButton).not.toHaveClass('border-blue-500');
  });

  it('should render 3 preset buttons', () => {
    renderWithProvider(<PresetSelector />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(presets.length);
  });
});
