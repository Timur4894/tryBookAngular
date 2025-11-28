import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  currentPlan: 'free' | 'premium' = 'free';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentPlan();
  }

  loadCurrentPlan(): void {
    const user = this.authService.getCurrentUser();
    if (user?.subscription) {
      // Check if user has active subscription
      const subscription = user.subscription;
      if (subscription && subscription.id) {
        this.currentPlan = 'premium';
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }

  selectPlan(plan: 'free' | 'premium'): void {
    if (plan === 'premium') {
      // In a real app, this would redirect to payment page
      console.log('Redirecting to payment for Premium plan...');
      // this.router.navigate(['/payment']);
    } else {
      // Handle downgrade to free
      console.log('Downgrading to Free plan...');
    }
  }
}

