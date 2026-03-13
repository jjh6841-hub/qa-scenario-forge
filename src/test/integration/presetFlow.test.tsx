import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AppProvider } from '../../context/AppContext';
import { InputPanel } from '../../components/input/InputPanel';
import { presets } from '../../data/presets';

vi.mock('../../hooks/useAnalysisPipeline', () => ({
  useAnalysisPipeline: () => ({
    runAnalysis: vi.fn(),
    isAnalyzing: false,
  }),
}));

function renderWithProvider(ui: ReactNode) {
  return render(<AppProvider>{ui}</AppProvider>);
}

describe('Preset selection flow', () => {
  it('should show preset buttons in the input panel', () => {
    renderWithProvider(<InputPanel />);
    for (const preset of presets) {
      expect(screen.getByText(preset.label)).toBeInTheDocument();
    }
  });

  it('should populate the textarea when a preset is clicked', () => {
    renderWithProvider(<InputPanel />);
    const firstPreset = presets[0];
    fireEvent.click(screen.getByText(firstPreset.label));

    const textarea = screen.getByRole('textbox');
    expect((textarea as HTMLTextAreaElement).value).toBe(firstPreset.spec);
  });

  it('should switch between presets correctly', () => {
    renderWithProvider(<InputPanel />);
    const firstPreset = presets[0];
    const secondPreset = presets[1];

    fireEvent.click(screen.getByText(firstPreset.label));
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toBe(firstPreset.spec);

    fireEvent.click(screen.getByText(secondPreset.label));
    expect(textarea.value).toBe(secondPreset.spec);
  });

  it('should enable the analyze button when a preset is selected', () => {
    renderWithProvider(<InputPanel />);
    const analyzeButton = screen.getByRole('button', { name: /QA 시나리오 분석 시작/i });
    expect(analyzeButton).toBeDisabled();

    fireEvent.click(screen.getByText(presets[0].label));
    expect(analyzeButton).not.toBeDisabled();
  });
});
