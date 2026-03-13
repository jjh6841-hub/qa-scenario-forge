import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AnalyzeButton } from '../../components/input/AnalyzeButton';

describe('AnalyzeButton', () => {
  it('should render with correct label when not analyzing', () => {
    const onAnalyze = vi.fn();
    render(
      <AnalyzeButton
        specText="테스트 스펙"
        isAnalyzing={false}
        onAnalyze={onAnalyze}
      />
    );
    expect(screen.getByText('✨ QA 시나리오 분석 시작')).toBeInTheDocument();
  });

  it('should be disabled when specText is empty', () => {
    const onAnalyze = vi.fn();
    render(
      <AnalyzeButton
        specText=""
        isAnalyzing={false}
        onAnalyze={onAnalyze}
      />
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should be disabled when specText is only whitespace', () => {
    const onAnalyze = vi.fn();
    render(
      <AnalyzeButton
        specText="   "
        isAnalyzing={false}
        onAnalyze={onAnalyze}
      />
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should be disabled when isAnalyzing is true', () => {
    const onAnalyze = vi.fn();
    render(
      <AnalyzeButton
        specText="테스트 스펙"
        isAnalyzing={true}
        onAnalyze={onAnalyze}
      />
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should show spinner and "분석 중..." when isAnalyzing is true', () => {
    const onAnalyze = vi.fn();
    render(
      <AnalyzeButton
        specText="테스트 스펙"
        isAnalyzing={true}
        onAnalyze={onAnalyze}
      />
    );
    expect(screen.getByText('분석 중...')).toBeInTheDocument();
    expect(screen.getByLabelText('로딩 중')).toBeInTheDocument();
  });

  it('should call onAnalyze when clicked and enabled', () => {
    const onAnalyze = vi.fn();
    render(
      <AnalyzeButton
        specText="테스트 스펙"
        isAnalyzing={false}
        onAnalyze={onAnalyze}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onAnalyze).toHaveBeenCalledOnce();
  });

  it('should not call onAnalyze when disabled', () => {
    const onAnalyze = vi.fn();
    render(
      <AnalyzeButton
        specText=""
        isAnalyzing={false}
        onAnalyze={onAnalyze}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onAnalyze).not.toHaveBeenCalled();
  });
});
