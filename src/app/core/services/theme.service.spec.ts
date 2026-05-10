import { TestBed, fakeAsync } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService (Task 4 — Service Testing)', () => {
  // Mock matchMedia before each test to control system preference
  function mockMatchMedia(prefersDark: boolean): void {
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn().mockReturnValue({ matches: prefersDark }),
      writable: true,
    });
  }

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('isDark() is false on init when system prefers light and nothing is stored', () => {
    mockMatchMedia(false);
    TestBed.configureTestingModule({});
    const service = TestBed.inject(ThemeService);
    TestBed.flushEffects();
    expect(service.isDark()).toBe(false);
  });

  it('isDark() is true on init when localStorage contains "dark"', () => {
    mockMatchMedia(false);
    localStorage.setItem('kanban-theme', 'dark');
    TestBed.configureTestingModule({});
    const service = TestBed.inject(ThemeService);
    expect(service.isDark()).toBe(true);
  });

  it('isDark() is false on init when localStorage contains "light"', () => {
    mockMatchMedia(true); // system prefers dark, but stored pref overrides
    localStorage.setItem('kanban-theme', 'light');
    TestBed.configureTestingModule({});
    const service = TestBed.inject(ThemeService);
    expect(service.isDark()).toBe(false);
  });

  it('toggle() flips isDark from false to true', fakeAsync(() => {
    mockMatchMedia(false);
    TestBed.configureTestingModule({});
    const service = TestBed.inject(ThemeService);
    TestBed.flushEffects();

    expect(service.isDark()).toBe(false);
    service.toggle();
    expect(service.isDark()).toBe(true);
  }));

  it('toggle() flips isDark from true to false', fakeAsync(() => {
    mockMatchMedia(false);
    localStorage.setItem('kanban-theme', 'dark');
    TestBed.configureTestingModule({});
    const service = TestBed.inject(ThemeService);
    TestBed.flushEffects();

    expect(service.isDark()).toBe(true);
    service.toggle();
    expect(service.isDark()).toBe(false);
  }));

  it('toggle() writes the new preference to localStorage', fakeAsync(() => {
    mockMatchMedia(false);
    TestBed.configureTestingModule({});
    const service = TestBed.inject(ThemeService);
    TestBed.flushEffects();

    service.toggle(); // now dark
    TestBed.flushEffects();
    expect(localStorage.getItem('kanban-theme')).toBe('dark');
  }));

  it('toggle() adds the "dark" class to <html> when switching to dark mode', fakeAsync(() => {
    mockMatchMedia(false);
    TestBed.configureTestingModule({});
    const service = TestBed.inject(ThemeService);
    TestBed.flushEffects();

    service.toggle(); // switch to dark
    TestBed.flushEffects();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  }));

  it('toggle() removes the "dark" class from <html> when switching to light mode', fakeAsync(() => {
    mockMatchMedia(false);
    localStorage.setItem('kanban-theme', 'dark');
    TestBed.configureTestingModule({});
    const service = TestBed.inject(ThemeService);
    TestBed.flushEffects();

    service.toggle(); // switch to light
    TestBed.flushEffects();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  }));
});
