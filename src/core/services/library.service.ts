import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';

export interface LibraryItem {
  id: number;
  user_id: number;
  book_id: number;
  added_at: string;
  reading_progress: number;
  last_read_at: string;
  book?: any;
}

export interface ReadingProgress {
  chapter: number;
  progress_percentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private apiUrl = '/api/library';
  private fakeLibrary: LibraryItem[] = [
    {
      id: 1,
      user_id: 1,
      book_id: 1,
      added_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      reading_progress: 45,
      last_read_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      user_id: 1,
      book_id: 3,
      added_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      reading_progress: 78,
      last_read_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      user_id: 1,
      book_id: 5,
      added_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      reading_progress: 12,
      last_read_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  constructor(private http: HttpClient) {}

  getLibrary(): Observable<LibraryItem[]> {
    // Фейковые данные
    return of([...this.fakeLibrary]).pipe(delay(300));
  }

  addToLibrary(bookId: number): Observable<LibraryItem> {
    // Фейковые данные
    const newItem: LibraryItem = {
      id: this.fakeLibrary.length + 1,
      user_id: 1,
      book_id: bookId,
      added_at: new Date().toISOString(),
      reading_progress: 0,
      last_read_at: new Date().toISOString()
    };
    this.fakeLibrary.push(newItem);
    return of(newItem).pipe(delay(300));
  }

  removeFromLibrary(bookId: number): Observable<void> {
    // Фейковые данные
    const index = this.fakeLibrary.findIndex(item => item.book_id === bookId);
    if (index !== -1) {
      this.fakeLibrary.splice(index, 1);
    }
    return of(undefined).pipe(delay(300));
  }

  updateProgress(bookId: number, progress: ReadingProgress): Observable<void> {
    // Фейковые данные
    const item = this.fakeLibrary.find(item => item.book_id === bookId);
    if (item) {
      item.reading_progress = progress.progress_percentage;
      item.last_read_at = new Date().toISOString();
    }
    return of(undefined).pipe(delay(300));
  }
}

