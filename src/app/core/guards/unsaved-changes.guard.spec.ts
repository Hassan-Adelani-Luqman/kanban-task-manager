import { unsavedChangesGuard, HasUnsavedChanges } from './unsaved-changes.guard';

describe('unsavedChangesGuard (Task 2 — Component Testing Fundamentals)', () => {
  // Create a minimal mock component that implements HasUnsavedChanges
  function makeComponent(hasChanges: boolean): HasUnsavedChanges {
    return { hasUnsavedChanges: () => hasChanges };
  }

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns true without prompting when the component has no unsaved changes', () => {
    const confirmSpy = jest.spyOn(window, 'confirm');
    const result = unsavedChangesGuard(makeComponent(false), {} as any, {} as any, {} as any);
    expect(result).toBe(true);
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('opens a confirm dialog when the component has unsaved changes', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    unsavedChangesGuard(makeComponent(true), {} as any, {} as any, {} as any);
    expect(window.confirm).toHaveBeenCalled();
  });

  it('returns true (allows navigation) when the user clicks OK in the confirm dialog', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    const result = unsavedChangesGuard(makeComponent(true), {} as any, {} as any, {} as any);
    expect(result).toBe(true);
  });

  it('returns false (blocks navigation) when the user cancels the confirm dialog', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    const result = unsavedChangesGuard(makeComponent(true), {} as any, {} as any, {} as any);
    expect(result).toBe(false);
  });
});
