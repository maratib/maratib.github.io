---
title: Angular Routing
slug: guides/angular/angular-routing
description: Angular Routing
sidebar:
  order: 11
---

### What's New in Angular 19 Routing?

**_Latest routing features and improvements in Angular 19+_**

#### Key Angular 19+ Routing Enhancements:

- **🚀 Standalone-First**: Native support for standalone components in routing
- **⚡ Signals Integration**: Reactive route data with signals
- **🎯 `loadComponent` API**: Direct component lazy loading without NgModules
- **📦 Enhanced Lazy Loading**: Improved dynamic imports and code splitting
- **🔧 `provideRouter` API**: Functional provider-based router configuration
- **📊 Route Guards as Functions**: Simplified guard implementation
- **🎨 Deferrable Views**: Component-level lazy loading with `@defer`

#### Modern Project Structure:

```
src/
├── app/
│   ├── app.config.ts
│   ├── app.routes.ts
│   ├── app.component.ts
│   └── features/
│       ├── products/
│       │   ├── products.routes.ts
│       │   ├── product-list.component.ts
│       │   └── product-detail.component.ts
│       └── admin/
│           ├── admin.routes.ts
│           └── *.component.ts
└── main.ts
```

---

### Modern Router Setup

**_Updated configuration for Angular 19+ applications_**

#### 1. Application Configuration (app.config.ts)

```typescript
// app.config.ts - Modern router configuration
import { ApplicationConfig } from "@angular/core";
import {
  provideRouter,
  withComponentInputBinding,
  withDebugTracing,
  withEnabledBlockingInitialNavigation,
  withPreloading,
  withRouterConfig,
} from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    // HTTP Client
    provideHttpClient(
      withInterceptors([
        /* authInterceptor */
      ])
    ),

    // Router Configuration
    provideRouter(
      routes,
      withComponentInputBinding(), // Enables @Input() from route params
      withEnabledBlockingInitialNavigation(), // Better SSR support
      withPreloading({ preloadingStrategy: "enabled", preloadDelay: 2000 }),
      withDebugTracing(), // Development only
      withRouterConfig({
        onSameUrlNavigation: "reload",
        paramsInheritanceStrategy: "always",
      })
    ),
  ],
};
```

#### 2. Bootstrap with Standalone (main.ts)

```typescript
// main.ts - Modern bootstrap
import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
```

#### 3. Root App Component

```typescript
// app.component.ts
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NavigationComponent } from "./navigation.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterModule, NavigationComponent],
  template: `
    <app-navigation />
    <main class="container">
      <router-outlet />
    </main>
  `,
})
export class AppComponent {}
```

---

### Standalone Component Routing

**_Modern routing with standalone components_**

#### 1. Basic Route Configuration (app.routes.ts)

```typescript
// app.routes.ts
import { Routes } from "@angular/router";

export const routes: Routes = [
  // Eager-loaded standalone components
  {
    path: "",
    loadComponent: () =>
      import("./home/home.component").then((c) => c.HomeComponent),
    title: "Home", // Route title
  },

  // Direct component loading with static import
  {
    path: "about",
    loadComponent: () =>
      import("./about/about.component").then((c) => c.AboutComponent),
    data: {
      breadcrumb: "About Us",
      feature: "about",
    },
  },

  // Lazy-loaded feature routes
  {
    path: "products",
    loadChildren: () =>
      import("./features/products/products.routes").then(
        (r) => r.PRODUCTS_ROUTES
      ),
  },

  // Lazy-loaded admin section
  {
    path: "admin",
    loadChildren: () =>
      import("./features/admin/admin.routes").then((r) => r.ADMIN_ROUTES),
    data: {
      requiresAuth: true,
      roles: ["admin"],
    },
  },

  // Redirects
  { path: "home", redirectTo: "", pathMatch: "full" },

  // 404 page
  {
    path: "**",
    loadComponent: () =>
      import("./not-found/not-found.component").then(
        (c) => c.NotFoundComponent
      ),
  },
];
```

#### 2. Feature Route Configuration

```typescript
// features/products/products.routes.ts
import { Routes } from "@angular/router";

export const PRODUCTS_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./product-list/product-list.component").then(
        (c) => c.ProductListComponent
      ),
    title: "Products",
  },
  {
    path: "new",
    loadComponent: () =>
      import("./product-create/product-create.component").then(
        (c) => c.ProductCreateComponent
      ),
    title: "Create Product",
  },
  {
    path: ":id",
    loadComponent: () =>
      import("./product-detail/product-detail.component").then(
        (c) => c.ProductDetailComponent
      ),
    title: "Product Details",
  },
  {
    path: ":id/edit",
    loadComponent: () =>
      import("./product-edit/product-edit.component").then(
        (c) => c.ProductEditComponent
      ),
    title: "Edit Product",
  },
];
```

#### 3. Standalone Component Example

```typescript
// product-list.component.ts
import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-product-list",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="products">
      <h1>Products</h1>

      <div class="search">
        <input
          type="text"
          placeholder="Search products..."
          [value]="searchQuery()"
          (input)="onSearch($event)"
        />
      </div>

      <div class="product-grid">
        @for (product of filteredProducts(); track product.id) {
        <div class="product-card">
          <h3>{{ product.name }}</h3>
          <p>{{ product.price | currency }}</p>
          <button [routerLink]="[product.id]" class="btn btn-primary">
            View Details
          </button>
        </div>
        }
      </div>

      <button routerLink="new" class="btn btn-success">Add New Product</button>
    </div>
  `,
  styles: [
    `
      .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
        margin: 2rem 0;
      }
      .product-card {
        border: 1px solid #ddd;
        padding: 1rem;
        border-radius: 8px;
      }
    `,
  ],
})
export class ProductListComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  products = signal([
    { id: 1, name: "Product 1", price: 99.99 },
    { id: 2, name: "Product 2", price: 149.99 },
    { id: 3, name: "Product 3", price: 199.99 },
  ]);

  searchQuery = signal("");

  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.products().filter((product) =>
      product.name.toLowerCase().includes(query)
    );
  });

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);

    // Update URL with search query
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: target.value || null },
      queryParamsHandling: "merge",
    });
  }
}
```

---

### Route Configuration Patterns

**_Advanced routing patterns in Angular 19+_**

#### 1. Component Input Binding

```typescript
// Enabled by withComponentInputBinding()
// product-detail.component.ts
import { Component, Input, OnInit } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <h1>Product {{ id }}</h1>
    <p>Category: {{ category }}</p>
  `
})
export class ProductDetailComponent implements OnInit {
  // Route parameters automatically bound to @Input()
  @Input() id!: string;
  @Input() category?: string;

  ngOnInit() {
    console.log('Product ID:', this.id);
    console.log('Category:', this.category);
  }
}

// Route configuration
{
  path: 'products/:id',
  loadComponent: () => import('./product-detail.component').then(c => c.ProductDetailComponent)
}

// URL: /products/123?category=electronics
// id = '123', category = 'electronics'
```

#### 2. Nested Routes with Standalone Components

```typescript
// features/admin/admin.routes.ts
export const ADMIN_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./admin-dashboard/admin-dashboard.component").then(
        (c) => c.AdminDashboardComponent
      ),
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./admin-home/admin-home.component").then(
            (c) => c.AdminHomeComponent
          ),
      },
      {
        path: "users",
        loadComponent: () =>
          import("./user-management/user-management.component").then(
            (c) => c.UserManagementComponent
          ),
      },
      {
        path: "settings",
        loadComponent: () =>
          import("./admin-settings/admin-settings.component").then(
            (c) => c.AdminSettingsComponent
          ),
      },
    ],
  },
];

// admin-dashboard.component.ts
@Component({
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <div class="admin-layout">
      <nav class="sidebar">
        <a routerLink="./" routerLinkActive="active">Dashboard</a>
        <a routerLink="./users" routerLinkActive="active">Users</a>
        <a routerLink="./settings" routerLinkActive="active">Settings</a>
      </nav>

      <div class="content">
        <router-outlet />
      </div>
    </div>
  `,
})
export class AdminDashboardComponent {}
```

#### 3. Route Guards as Functions

```typescript
// guards/auth.guard.ts
import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login
  router.navigate(['/login'], {
    queryParams: { returnUrl: segments.join('/') }
  });
  return false;
};

export const adminGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  return authService.hasRole('admin');
};

// Usage in routes
{
  path: 'admin',
  loadChildren: () => import('./admin/admin.routes').then(r => r.ADMIN_ROUTES),
  canMatch: [authGuard, adminGuard]
}
```

#### 4. Resolvers with Signals

```typescript
// resolvers/product.resolver.ts
import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ProductService } from '../services/product.service';

export const productResolver: ResolveFn<any> = (route, state) => {
  const productService = inject(ProductService);
  const productId = route.paramMap.get('id');

  if (!productId) {
    throw new Error('Product ID is required');
  }

  return productService.getProduct(productId);
};

// Usage
{
  path: ':id',
  loadComponent: () => import('./product-detail.component').then(c => c.ProductDetailComponent),
  resolve: {
    product: productResolver
  }
}
```

---

### Signals Integration

**_Reactive routing with Angular Signals_**

#### 1. Route Data with Signals

```typescript
// product-detail.component.ts
import { Component, inject, signal, computed } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
  standalone: true,
  template: `
    <div class="product-detail">
      @if (product()) {
      <h1>{{ product()!.name }}</h1>
      <p class="price">{{ product()!.price | currency }}</p>
      <p>{{ product()!.description }}</p>
      } @else if (isLoading()) {
      <p>Loading product...</p>
      } @else {
      <p>Product not found</p>
      }

      <div class="actions">
        <button (click)="goBack()">Back</button>
        <button [routerLink]="['edit']">Edit</button>
      </div>
    </div>
  `,
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Convert route data to signals
  routeParams = toSignal(this.route.paramMap);
  queryParams = toSignal(this.route.queryParamMap);
  routeData = toSignal(this.route.data);

  // Computed values from route
  productId = computed(() => this.routeParams()?.get("id"));
  editMode = computed(() => this.queryParams()?.get("mode") === "edit");

  // Component state
  product = signal<any>(null);
  isLoading = signal(false);

  ngOnInit() {
    this.loadProduct();
  }

  private async loadProduct() {
    const id = this.productId();
    if (!id) return;

    this.isLoading.set(true);

    // Simulate API call
    setTimeout(() => {
      this.product.set({
        id: id,
        name: `Product ${id}`,
        price: 99.99,
        description: "This is a product description",
      });
      this.isLoading.set(false);
    }, 1000);
  }

  goBack() {
    this.router.navigate(["../"], { relativeTo: this.route });
  }
}
```

#### 2. Reactive Navigation Service

```typescript
// services/navigation.service.ts
import { Injectable, inject, signal } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter, map } from "rxjs/operators";
import { toSignal } from "@angular/core/rxjs-interop";

@Injectable({ providedIn: "root" })
export class NavigationService {
  private router = inject(Router);

  // Reactive current route
  currentRoute = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).urlAfterRedirects)
    ),
    { initialValue: "/" }
  );

  // Current route segments
  currentSegments = computed(() => {
    const route = this.currentRoute();
    return route.split("/").filter((segment) => segment.length > 0);
  });

  // Breadcrumb data
  breadcrumbs = computed(() => {
    const segments = this.currentSegments();
    return segments.map((segment, index) => ({
      label: this.formatSegment(segment),
      path: "/" + segments.slice(0, index + 1).join("/"),
    }));
  });

  private formatSegment(segment: string): string {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Navigation methods
  navigateTo(commands: any[], extras?: any) {
    return this.router.navigate(commands, extras);
  }

  isActive(path: string): boolean {
    return this.currentRoute().startsWith(path);
  }
}
```

---

### Advanced Routing Features

**_Powerful routing patterns for complex applications_**

#### 1. Multiple Router Outlets

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent),
    children: [
      { path: '', loadComponent: () => import('./dashboard/home.component').then(c => c.DashboardHomeComponent) },
      {
        path: 'messages',
        loadComponent: () => import('./dashboard/messages.component').then(c => c.DashboardMessagesComponent),
        outlet: 'sidebar'
      }
    ]
  }
];

// dashboard.component.ts
@Component({
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="dashboard">
      <div class="main-content">
        <router-outlet />
      </div>
      <div class="sidebar">
        <router-outlet name="sidebar" />
      </div>
    </div>
  `
})
export class DashboardComponent { }

// Navigation to named outlet
navigateToMessages() {
  this.router.navigate([
    { outlets: { primary: ['dashboard'], sidebar: ['messages'] } }
  ]);
}
```

#### 2. Route Events and Analytics

```typescript
// services/analytics.service.ts
import { Injectable, inject } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class AnalyticsService {
  private router = inject(Router);

  initialize() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.trackPageView((event as NavigationEnd).urlAfterRedirects);
      });
  }

  private trackPageView(url: string) {
    // Send to analytics service
    console.log("Page view:", url);

    // Example: Google Analytics
    if (typeof gtag !== "undefined") {
      gtag("config", "GA_MEASUREMENT_ID", {
        page_path: url,
      });
    }
  }
}
```

#### 3. Custom Route Reuse Strategy

```typescript
// strategies/custom-route-reuse.strategy.ts
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
} from "@angular/router";

@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private storedRoutes = new Map<string, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.routeConfig?.data?.["reuse"] === true;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.storedRoutes.set(this.getRouteKey(route), handle);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return this.storedRoutes.has(this.getRouteKey(route));
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return this.storedRoutes.get(this.getRouteKey(route)) || null;
  }

  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  private getRouteKey(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot.map((r) => r.url.join("/")).join("/");
  }
}

// Provide in app.config.ts
providers: [
  { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
];
```

---

### Performance & Optimization

**_Optimizing routing performance in Angular 19+_**

#### 1. Lazy Loading with Preloading

```typescript
// app.config.ts
provideRouter(
  routes,
  withPreloading({
    preloadingStrategy: 'enabled',
    preloadDelay: 2000,
    // Custom preloading
    preload: (route) => route.data?.['preload'] === true
  })
)

// Route configuration with preloading
{
  path: 'dashboard',
  loadChildren: () => import('./dashboard/dashboard.routes').then(r => r.DASHBOARD_ROUTES),
  data: { preload: true } // Will be preloaded after 2 seconds
}
```

#### 2. Deferrable Views for Components

```typescript
// product-detail.component.ts
@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-detail">
      <!-- Critical content -->
      <h1>{{ product().name }}</h1>
      <p>{{ product().price | currency }}</p>

      <!-- Lazy load heavy components -->
      @defer (on viewport) {
      <app-product-recommendations [productId]="product().id" />
      } @placeholder {
      <div class="recommendations-placeholder">Loading recommendations...</div>
      } @defer (on interaction) {
      <app-product-reviews [productId]="product().id" />
      } @placeholder {
      <button class="load-reviews">Load Reviews</button>
      } @defer (on timer(2s)) {
      <app-related-products [productId]="product().id" />
      }
    </div>
  `,
})
export class ProductDetailComponent {}
```

#### 3. Route Level Code Splitting

```typescript
// Optimized route configuration
export const routes: Routes = [
  {
    path: "reports",
    loadChildren: () =>
      import(
        /* webpackChunkName: "reports" */
        "./features/reports/reports.routes"
      ).then((r) => r.REPORTS_ROUTES),
  },
  {
    path: "analytics",
    loadComponent: () =>
      import(
        /* webpackChunkName: "analytics" */
        "./features/analytics/analytics.component"
      ).then((c) => c.AnalyticsComponent),
  },
];
```

---

### Best Practices & Patterns

**_Professional routing patterns for Angular 19+_**

#### 1. Route Organization

```typescript
// features/products/products.routes.ts
export const PRODUCTS_ROUTES: Routes = [
  // List view
  { path: "", component: ProductListComponent, title: "Products" },

  // Detail views
  { path: "new", component: ProductCreateComponent, title: "New Product" },
  { path: ":id", component: ProductDetailComponent, title: "Product Details" },
  { path: ":id/edit", component: ProductEditComponent, title: "Edit Product" },

  // Nested features
  {
    path: ":id/reviews",
    loadChildren: () =>
      import("./reviews/reviews.routes").then((r) => r.REVIEWS_ROUTES),
  },
];

// Centralized route configuration
export const APP_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./home/home.component").then((c) => c.HomeComponent),
  },
  {
    path: "products",
    loadChildren: () =>
      import("./products/products.routes").then((r) => r.PRODUCTS_ROUTES),
  },
  {
    path: "**",
    loadComponent: () =>
      import("./not-found/not-found.component").then(
        (c) => c.NotFoundComponent
      ),
  },
];
```

#### 2. Error Handling

```typescript
// error-handling.component.ts
@Component({
  standalone: true,
  template: `
    <div class="error-boundary">
      @if (error()) {
      <div class="error-message">
        <h2>Something went wrong</h2>
        <p>{{ error().message }}</p>
        <button (click)="retry()">Retry</button>
        <button (click)="goHome()">Go Home</button>
      </div>
      } @else {
      <ng-content />
      }
    </div>
  `,
})
export class ErrorBoundaryComponent {
  error = signal<Error | null>(null);

  retry() {
    this.error.set(null);
    // Trigger reload or retry logic
  }

  goHome() {
    this.router.navigate(["/"]);
  }
}
```

#### 3. Type-Safe Routes

```typescript
// types/routes.types.ts
export type AppRoutes = {
  "/": void;
  "/products": void;
  "/products/:id": { id: string };
  "/products/:id/edit": { id: string };
  "/admin": void;
};

// Type-safe navigation service
@Injectable({ providedIn: "root" })
export class TypedRouterService {
  private router = inject(Router);

  navigateToHome() {
    this.router.navigate(["/"]);
  }

  navigateToProduct(id: string) {
    this.router.navigate(["/products", id]);
  }

  navigateToProductEdit(id: string) {
    this.router.navigate(["/products", id, "edit"]);
  }
}
```

#### 4. Modern Navigation Component

```typescript
// navigation.component.ts
import { Component, inject, signal } from "@angular/core";
import { RouterModule, NavigationService } from "./navigation.service";

@Component({
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <a routerLink="/">MyApp</a>
      </div>

      <ul class="nav-links">
        @for (item of navItems(); track item.path) {
        <li>
          <a
            [routerLink]="item.path"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: item.exact }"
          >
            {{ item.label }}
          </a>
        </li>
        }
      </ul>

      <div class="breadcrumbs">
        @for (crumb of breadcrumbs(); track crumb.path; let last = $last) {
        <span>
          <a [routerLink]="crumb.path" [class.last]="last">
            {{ crumb.label }}
          </a>
          @if (!last) {
          <span class="separator">/</span>
          }
        </span>
        }
      </div>
    </nav>
  `,
})
export class NavigationComponent {
  private navigationService = inject(NavigationService);

  navItems = signal([
    { path: "/", label: "Home", exact: true },
    { path: "/products", label: "Products", exact: false },
    { path: "/about", label: "About", exact: false },
  ]);

  breadcrumbs = this.navigationService.breadcrumbs;
}
```
