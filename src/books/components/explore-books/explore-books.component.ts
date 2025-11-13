import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { CustomTextInputComponent } from '../../../shared/components/custom-text-input/custom-text-input.component';
import { Book } from '../../../core/services/book.service';

@Component({
  selector: 'app-explore-books',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomTextInputComponent],
  templateUrl: './explore-books.component.html',
  styleUrls: ['./explore-books.component.scss']
})
export class ExploreBooksComponent implements OnInit {
  searchTerm: string = '';
  books: Book[] = [];
  isLoading: boolean = false;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.bookService.getBooks({
      page: this.currentPage,
      limit: 20,
      search: this.searchTerm || undefined
    }).subscribe({
      next: (response) => {
        this.books = response.books;
        this.totalPages = response.pagination.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading books:', err);
        this.isLoading = false;
      }
    });
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.loadBooks();
  }

  navigateToBookDetail(bookId: number): void {
    this.router.navigate(['/books', bookId]);
  }
}

