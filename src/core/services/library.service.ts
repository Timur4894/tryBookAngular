import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LibraryItem {
  id: number;
  user_id: number;
  book_id: number;
  added_at?: string;
  reading_progress?: number;
  last_read_at?: string;
  book?: any;
}

export interface ReadingProgress {
  chapter?: number;
  progress_percentage?: number;
  progress?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private readingHistoryUrl = `${environment.apiUrl}/api/users/reading-history`;
  private borrowsUrl = `${environment.apiUrl}/api/borrows`;

  constructor(private http: HttpClient) {}

  getLibrary(): Observable<LibraryItem[]> {
    return this.http.get<any[]>(this.readingHistoryUrl).pipe(
      map(items => items.map(item => this.normalizeLibraryItem(item)))
    );
  }

  addToLibrary(bookId: number): Observable<LibraryItem> {
    return this.http.post<any>(`${this.borrowsUrl}/borrow`, { book_id: bookId }).pipe(
      map(record => this.normalizeLibraryItem(record))
    );
  }

  removeFromLibrary(bookId: number): Observable<void> {
    return this.http.get<any[]>(`${this.borrowsUrl}/active`).pipe(
      map(records => records.find(record => (record.book_id ?? record.bookId) === bookId)),
      switchMap(record => {
        if (!record) {
          return throwError(() => new Error('Active borrow record not found for this book'));
        }
        return this.http.put<void>(`${this.borrowsUrl}/return/${record.id}`, {});
      })
    );
  }

  updateProgress(bookId: number, progress: ReadingProgress): Observable<void> {
    const progressValue = progress.progress_percentage ?? progress.progress ?? 0;
    return this.http.post<void>(`${environment.apiUrl}/api/books/${bookId}/progress`, {
      progress: progressValue,
      chapter: progress.chapter
    });
  }

  private normalizeLibraryItem(item: any): LibraryItem {
    if (!item) {
      return {
        id: 0,
        user_id: 0,
        book_id: 0,
        reading_progress: 0
      };
    }

    return {
      id: item.id,
      user_id: item.user_id ?? item.userId ?? 0,
      book_id: item.book_id ?? item.bookId ?? item.book?.id ?? 0,
      added_at: item.added_at ?? item.created_at ?? item.borrowed_at,
      reading_progress: item.reading_progress ?? item.progress ?? 0,
      last_read_at: item.last_read_at ?? item.updated_at ?? item.returned_at,
      book: item.book
    };
  }
}

