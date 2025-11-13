import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/services/book.service';

@Component({
  selector: 'app-book-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-content.component.html',
  styleUrls: ['./book-content.component.scss']
})
export class BookContentComponent implements OnInit {
  book: Book | null = null;
  currentChapter: number = 1;
  content: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.loadBook(+bookId);
      this.loadContent(+bookId, this.currentChapter);
    }
  }

  loadBook(id: number): void {
    this.bookService.getBookById(id).subscribe({
      next: (book) => {
        this.book = book;
      },
      error: (err) => {
        console.error('Error loading book:', err);
      }
    });
  }

  loadContent(bookId: number, chapter: number): void {
    // In a real app, this would fetch chapter content from the API
    this.content = `Chapter ${chapter} content... Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;
  }

  goBack(): void {
    this.router.navigate(['/books', this.book?.id]);
  }

  previousChapter(): void {
    if (this.currentChapter > 1) {
      this.currentChapter--;
      if (this.book) {
        this.loadContent(this.book.id, this.currentChapter);
      }
    }
  }

  nextChapter(): void {
    this.currentChapter++;
    if (this.book) {
      this.loadContent(this.book.id, this.currentChapter);
    }
  }
}

