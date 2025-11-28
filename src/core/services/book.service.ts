import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Book {
  id: number;
  title: string;
  author?: string;
  author_name?: string;
  description?: string;
  cover_image?: string;
  cover_url?: string;
  file_url?: string;
  pages?: number;
  language?: string;
  rating?: number;
  genre_id?: number;
  publication_year?: number;
  is_premium?: boolean;
}

export interface BooksResponse {
  books: Book[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/api/books`;

  constructor(private http: HttpClient) {}

  getBooks(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    genre?: string;
    premium?: boolean | string;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Observable<BooksResponse> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          return;
        }

        if (key === 'category' && !params.genre) {
          httpParams = httpParams.set('genre', String(value));
          return;
        }

        httpParams = httpParams.set(key, String(value));
      });
    }

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      map(response => this.transformBooksResponse(response, params))
    );
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(book => this.normalizeBook(book))
    );
  }

  searchBooks(searchTerm: string): Observable<BooksResponse> {
    return this.getBooks({ search: searchTerm });
  }

  createBook(book: Partial<Book>): Observable<Book> {
    return this.http.post<any>(this.apiUrl, book).pipe(
      map(created => this.normalizeBook(created))
    );
  }

  updateBook(id: number, book: Partial<Book>): Observable<Book> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, book).pipe(
      map(updated => this.normalizeBook(updated))
    );
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private transformBooksResponse(response: any, params?: { page?: number; limit?: number }): BooksResponse {
    if (!response) {
      return {
        books: [],
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 0,
          total: 0,
          totalPages: 0
        }
      };
    }

    if (response.books && response.pagination) {
      return {
        books: response.books.map((book: any) => this.normalizeBook(book)),
        pagination: this.normalizePagination(response.pagination)
      };
    }

    if (Array.isArray(response.data)) {
      const paginationSource = response.meta || response.pagination || {};
      return {
        books: response.data.map((book: any) => this.normalizeBook(book)),
        pagination: this.normalizePagination({
          page: paginationSource.page ?? response.page ?? params?.page ?? 1,
          limit: paginationSource.limit ?? response.limit ?? params?.limit ?? response.data.length,
          total: paginationSource.total ?? response.total ?? response.count ?? response.data.length,
          totalPages:
            paginationSource.totalPages ??
            paginationSource.pages ??
            response.totalPages ??
            (paginationSource.total && paginationSource.limit
              ? Math.ceil(paginationSource.total / paginationSource.limit)
              : 1)
        })
      };
    }

    if (Array.isArray(response)) {
      return {
        books: response.map(book => this.normalizeBook(book)),
        pagination: this.normalizePagination({
          page: params?.page ?? 1,
          limit: params?.limit ?? response.length,
          total: response.length,
          totalPages: 1
        })
      };
    }

    if (response.results) {
      return {
        books: response.results.map((book: any) => this.normalizeBook(book)),
        pagination: this.normalizePagination({
          page: response.page ?? params?.page ?? 1,
          limit: response.limit ?? params?.limit ?? response.results.length,
          total: response.total ?? response.count ?? response.results.length,
          totalPages: response.totalPages ?? response.pages ?? 1
        })
      };
    }

    const normalizedBook = this.normalizeBook(response);
    return {
      books: normalizedBook ? [normalizedBook] : [],
      pagination: this.normalizePagination({
        page: params?.page ?? 1,
        limit: params?.limit ?? 1,
        total: normalizedBook ? 1 : 0,
        totalPages: normalizedBook ? 1 : 0
      })
    };
  }

  private normalizePagination(pagination: any): BooksResponse['pagination'] {
    return {
      page: pagination?.page ?? 1,
      limit: pagination?.limit ?? pagination?.per_page ?? 10,
      total: pagination?.total ?? pagination?.total_items ?? pagination?.count ?? 0,
      totalPages: pagination?.totalPages ?? pagination?.total_pages ?? pagination?.pages ?? 1
    };
  }

  private normalizeBook(book: any): Book {
    if (!book) {
      return {
        id: 0,
        title: 'Untitled',
        author: 'Unknown author'
      };
    }

    const coverImage = book.cover_image || book.cover_url || book.coverUrl || book.coverImage;

    const id = typeof book.id === 'string' ? parseInt(book.id, 10) : book.id;

    return {
      id,
      title: book.title || 'Untitled',
      author: book.author ?? book.author_name ?? book.authorName ?? 'Unknown author',
      author_name: book.author_name ?? book.author ?? book.authorName ?? 'Unknown author',
      description: book.description,
      cover_image: coverImage,
      cover_url: coverImage,
      file_url: book.file_url ?? book.fileUrl,
      pages: book.pages ?? book.page_count ?? book.total_pages ?? 0,
      language: book.language ?? book.lang ?? 'N/A',
      rating: book.rating ?? book.average_rating ?? 0,
      genre_id: book.genre_id ?? book.genreId,
      publication_year: book.publication_year ?? book.year,
      is_premium: book.is_premium ?? book.premium ?? false
    };
  }
}

