import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Board } from '../models/board.models';
import { SEED_DATA } from '../data/seed-data';

const STORAGE_KEY = 'kanban-boards';

/**
 * BoardDataService — wraps localStorage in Observables.
 *
 * This gives NgRx Effects the same interface they would use with HttpClient:
 *   getBoards()    →  like  httpClient.get<Board[]>('/api/boards')
 *   saveBoards()   →  like  httpClient.put<Board[]>('/api/boards', boards)
 *
 * To switch to a real API later, only this service needs to change.
 * All Effects stay identical.
 */
@Injectable({ providedIn: 'root' })
export class BoardDataService {
  /** Load all boards — returns an Observable so Effects can use switchMap/catchError */
  getBoards(): Observable<Board[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const boards: Board[] = raw
        ? JSON.parse(raw)
        : JSON.parse(JSON.stringify(SEED_DATA));
      return of(boards);
    } catch {
      return of(JSON.parse(JSON.stringify(SEED_DATA)));
    }
  }

  /** Persist the full boards array — returns an Observable for consistency */
  saveBoards(boards: Board[]): Observable<Board[]> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
    return of(boards);
  }
}
