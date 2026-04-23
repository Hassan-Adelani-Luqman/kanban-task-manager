import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center h-full text-center p-8">
      <h1 class="heading-xl text-black dark:text-white mb-4">404 — Page Not Found</h1>
      <p class="body-l text-medium-gray mb-8">
        The page you're looking for doesn't exist.
      </p>
      <a
        routerLink="/"
        class="bg-primary hover:bg-primary-light text-white heading-m rounded-full px-6 py-4 transition-colors"
      >
        Go Home
      </a>
    </div>
  `,
})
export class NotFound {}
