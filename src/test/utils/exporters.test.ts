import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportToJSON, exportToMarkdown } from '../../utils/exporters';
import type { AnalysisResults } from '../../types';
import { mockRisks, mockScenarios, mockCases, mockPlaywrightFiles } from '../mocks/apiFixtures';

const mockResults: AnalysisResults = {
  risks: { status: 'complete', data: mockRisks, error: null },
  scenarios: { status: 'complete', data: mockScenarios, error: null },
  cases: { status: 'complete', data: mockCases, error: null },
  code: { status: 'complete', data: mockPlaywrightFiles, error: null },
};

const specText = '테스트 기능 명세서 내용';

describe('exportToJSON', () => {
  let mockAnchor: HTMLAnchorElement;
  let clickSpy: ReturnType<typeof vi.fn>;
  let appendChildSpy: ReturnType<typeof vi.fn>;
  let removeChildSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    clickSpy = vi.fn();
    appendChildSpy = vi.fn();
    removeChildSpy = vi.fn();

    mockAnchor = {
      href: '',
      download: '',
      click: clickSpy,
    } as unknown as HTMLAnchorElement;

    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor);
    vi.spyOn(document.body, 'appendChild').mockImplementation(appendChildSpy as unknown as (node: Node) => Node);
    vi.spyOn(document.body, 'removeChild').mockImplementation(removeChildSpy as unknown as (child: Node) => Node);
  });

  it('should create an anchor element with download attribute', () => {
    exportToJSON(mockResults, specText);
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockAnchor.download).toMatch(/^qa-scenario-forge-\d{4}-\d{2}-\d{2}\.json$/);
  });

  it('should trigger a click on the anchor element', () => {
    exportToJSON(mockResults, specText);
    expect(clickSpy).toHaveBeenCalledOnce();
  });

  it('should call URL.createObjectURL', () => {
    exportToJSON(mockResults, specText);
    expect(URL.createObjectURL).toHaveBeenCalledOnce();
  });

  it('should call URL.revokeObjectURL after download', () => {
    exportToJSON(mockResults, specText);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('should include specText in the JSON blob', () => {
    const blobSpy = vi.spyOn(globalThis, 'Blob');
    exportToJSON(mockResults, specText);
    expect(blobSpy).toHaveBeenCalledOnce();
    const blobContent = blobSpy.mock.calls[0][0] as string[];
    expect(blobContent[0]).toContain(specText);
  });

  it('should set correct MIME type for JSON', () => {
    const blobSpy = vi.spyOn(globalThis, 'Blob');
    exportToJSON(mockResults, specText);
    const blobOptions = blobSpy.mock.calls[0][1] as BlobPropertyBag;
    expect(blobOptions.type).toBe('application/json');
  });
});

describe('exportToMarkdown', () => {
  let mockAnchor: HTMLAnchorElement;

  beforeEach(() => {
    mockAnchor = {
      href: '',
      download: '',
      click: vi.fn(),
    } as unknown as HTMLAnchorElement;

    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor);
    vi.spyOn(document.body, 'appendChild').mockImplementation(vi.fn());
    vi.spyOn(document.body, 'removeChild').mockImplementation(vi.fn());
  });

  it('should create a file with .md extension', () => {
    exportToMarkdown(mockResults, specText);
    expect(mockAnchor.download).toMatch(/\.md$/);
  });

  it('should include risks section in markdown', () => {
    const blobSpy = vi.spyOn(globalThis, 'Blob');
    exportToMarkdown(mockResults, specText);
    const blobContent = blobSpy.mock.calls[0][0] as string[];
    expect(blobContent[0]).toContain('## 리스크 분석 결과');
  });

  it('should include scenarios section in markdown', () => {
    const blobSpy = vi.spyOn(globalThis, 'Blob');
    exportToMarkdown(mockResults, specText);
    const blobContent = blobSpy.mock.calls[0][0] as string[];
    expect(blobContent[0]).toContain('## 테스트 시나리오');
  });

  it('should include test cases section in markdown', () => {
    const blobSpy = vi.spyOn(globalThis, 'Blob');
    exportToMarkdown(mockResults, specText);
    const blobContent = blobSpy.mock.calls[0][0] as string[];
    expect(blobContent[0]).toContain('## 테스트 케이스');
  });

  it('should include playwright code section in markdown', () => {
    const blobSpy = vi.spyOn(globalThis, 'Blob');
    exportToMarkdown(mockResults, specText);
    const blobContent = blobSpy.mock.calls[0][0] as string[];
    expect(blobContent[0]).toContain('## Playwright 자동화 코드');
  });

  it('should set correct MIME type for markdown', () => {
    const blobSpy = vi.spyOn(globalThis, 'Blob');
    exportToMarkdown(mockResults, specText);
    const blobOptions = blobSpy.mock.calls[0][1] as BlobPropertyBag;
    expect(blobOptions.type).toBe('text/markdown');
  });
});
