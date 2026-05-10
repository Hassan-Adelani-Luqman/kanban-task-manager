import { authGuard } from './auth.guard';

describe('authGuard (Task 2 — Component Testing Fundamentals)', () => {
  // authGuard is a plain function — no Angular DI or TestBed required
  it('returns true for any route, allowing all navigation', () => {
    // The guard takes ActivatedRouteSnapshot and RouterStateSnapshot but ignores them
    const result = authGuard({} as any, {} as any);
    expect(result).toBe(true);
  });
});
