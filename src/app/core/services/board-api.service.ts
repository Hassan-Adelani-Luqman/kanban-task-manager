import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { Board } from '../models/board.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BoardApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/boards`;

  // shareReplay(1) caches the last emission and replays it to new subscribers.
  private readonly boards$ = this.http.get<Board[]>(this.base).pipe(shareReplay(1));

  getBoards(): Observable<Board[]> {
    return this.boards$;
  }

  getBoard(id: string): Observable<Board> {
    return this.http.get<Board>(`${this.base}/${id}`);
  }

  createBoard(board: Board): Observable<Board> {
    return this.http.post<Board>(this.base, board);
  }

  updateBoard(board: Board): Observable<Board> {
    return this.http.put<Board>(`${this.base}/${board.id}`, board);
  }

  deleteBoard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
