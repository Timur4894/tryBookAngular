import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LibraryService, LibraryItem } from '../../../core/services/library.service';
import { BookService, Book } from '../../../core/services/book.service';
import { CustomTextInputComponent } from '../../../shared/components/custom-text-input/custom-text-input.component';

interface LibraryItemWithBook extends LibraryItem {
  book?: Book;
}

@Component({
  selector: 'app-my-library',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomTextInputComponent],
  templateUrl: './my-library.component.html',
  styleUrls: ['./my-library.component.scss']
})
export class MyLibraryComponent implements OnInit {
  searchTerm: string = '';
  libraryItems: LibraryItemWithBook[] = [];
  isLoading: boolean = false;

  constructor(
    private libraryService: LibraryService,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLibrary();
  }

  loadLibrary(): void {
    this.isLoading = true;
    this.libraryService.getLibrary().subscribe({
      next: (items) => {
        this.libraryItems = items.map(item => ({ ...item, book: undefined }));
        
        items.forEach(item => {
          this.bookService.getBookById(item.book_id).subscribe({
            next: (book) => {
              const libraryItem = this.libraryItems.find(li => li.id === item.id);
              if (libraryItem) {
                libraryItem.book = book;
              }
            }
          });
        });
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading library:', err);
        this.isLoading = false;
      }
    });
  }

  navigateToBookDetail(bookId: number): void {
    this.router.navigate(['/books', bookId]);
  }

  navigateToBookContent(bookId: number): void {
    this.router.navigate(['/books', bookId, 'read']);
  }

  navigateToBooks(): void {
    this.router.navigate(['/books']);
  }

  getProgressPercentage(item: LibraryItem): number {
    return item.reading_progress || 0;
  }

  getProgressText(item: LibraryItem): string {
    const progress = item.reading_progress || 0;
    return `${progress}% read`;
  }

}

