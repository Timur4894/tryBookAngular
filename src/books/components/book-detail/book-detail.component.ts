import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { LibraryService } from '../../../core/services/library.service';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';
import { Book } from '../../../core/services/book.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, CustomButtonComponent],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  isLoading: boolean = false;
  isInLibrary: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private libraryService: LibraryService
  ) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.loadBook(+bookId);
      this.checkLibraryStatus(+bookId);
    }
  }

  loadBook(id: number): void {
    this.isLoading = true;
    this.bookService.getBookById(id).subscribe({
      next: (book) => {
        this.book = book;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading book:', err);
        this.isLoading = false;
      }
    });
  }

  checkLibraryStatus(bookId: number): void {
    this.libraryService.getLibrary().subscribe({
      next: (items) => {
        this.isInLibrary = items.some(item => item.book_id === bookId);
      }
    });
  }

  onReadNow(): void {
    if (this.book) {
      this.router.navigate(['/books', this.book.id, 'read']);
    }
  }

  onAddToLibrary(): void {
    if (this.book) {
      this.libraryService.addToLibrary(this.book.id).subscribe({
        next: () => {
          this.isInLibrary = true;
        },
        error: (err) => {
          console.error('Error adding to library:', err);
        }
      });
    }
  }
}

