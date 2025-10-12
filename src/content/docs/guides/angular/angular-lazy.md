---
title: Angular Lazy Loading
slug: guides/angular/angular-lazy
description: Angular Lazy Loading
sidebar:
  order: 11
---

### What's New in Angular 19?

**_Latest features and improvements specific to Angular 19+_**

### Key Angular 19+ Features for Lazy Loading:

- **🚀 Enhanced Standalone Components**: First-class support for lazy loading standalone components
- **📦 Improved ES Module Support**: Better tree-shaking and dynamic imports
- **⚡ Signals Integration**: Reactive routing with signals
- **🎯 Deferrable Views**: New `@defer` syntax for component-level lazy loading
- **🔥 Vite as Default**: Faster builds and better development experience
- **📊 Enhanced DevTools**: Better lazy loading visualization

### Modern Angular 19+ Project Structure:

```
src/
├── app/
│   ├── app.config.ts
│   ├── app.routes.ts
│   ├── app.component.ts
│   └── features/
│       ├── products/
│       │   ├── products.routes.ts
│       │   └── *.ts
│       └── admin/
│           ├── admin.routes.ts
│           └── *.ts
└── main.ts
```

---

### Modern Lazy Loading Setup

**_Updated configuration for Angular 19+ applications_**

#### 1. Application Configuration (app.config.ts)

```typescript
// app.config.ts - Using provideRouter for modern setup
import { ApplicationConfig } from "@angular/core";
import {
  provideRouter,
  withPreloading,
  withDebugTracing,
} from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(
      routes,
      withPreloading({
        preloadingStrategy: "enabled", // Modern preloading
        preloadDelay: 2000,
      }),
      withDebugTracing() // Optional: for development
    ),
  ],
};
```

#### 2. Modern Route Configuration (app.routes.ts)

```typescript
// app.routes.ts - Using modern Route[] syntax
import { Routes } from "@angular/router";

export const routes: Routes = [
  // Eager-loaded standalone components
  {
    path: "",
    loadComponent: () =>
      import("./home/home.component").then((c) => c.HomeComponent),
  },

  // Lazy-loaded feature routes
  {
    path: "products",
    loadChildren: () =>
      import("./features/products/products.routes").then(
        (r) => r.PRODUCTS_ROUTES
      ),
  },

  // Lazy-loaded admin section with modern syntax
  {
    path: "admin",
    loadChildren: () =>
      import("./features/admin/admin.routes").then((r) => r.ADMIN_ROUTES),
    data: {
      preload: true, // Custom preloading flag
      permissions: ["admin"],
    },
  },

  // Lazy-loaded user profile with guards
  {
    path: "profile",
    loadChildren: () =>
      import("./features/profile/profile.routes").then((r) => r.PROFILE_ROUTES),
    canMatch: [authGuard], // Modern guard syntax
  },

  // Wildcard route with standalone component
  {
    path: "**",
    loadComponent: () =>
      import("./not-found/not-found.component").then(
        (c) => c.NotFoundComponent
      ),
  },
];
```

#### 3. Bootstrap with Standalone (main.ts)

```typescript
// main.ts - Modern bootstrap
import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
```

---

### Standalone Component Lazy Loading

**_Lazy loading individual standalone components in Angular 19+_**

#### 1. Component-Level Lazy Loading

```typescript
// app.routes.ts - Lazy loading standalone components
import { Routes } from "@angular/router";

export const routes: Routes = [
  // Direct component lazy loading
  {
    path: "dashboard",
    loadComponent: () =>
      import("./features/dashboard/dashboard.component").then(
        (c) => c.DashboardComponent
      ),
  },

  // With providers and configuration
  {
    path: "settings",
    loadComponent: () =>
      import("./features/settings/settings.component").then(
        (c) => c.SettingsComponent
      ),
    providers: [
      // Component-specific providers
      SettingsService,
    ],
  },

  // Nested standalone components
  {
    path: "user/:id",
    loadComponent: () =>
      import("./features/user/user-detail.component").then(
        (c) => c.UserDetailComponent
      ),
    children: [
      {
        path: "edit",
        loadComponent: () =>
          import("./features/user/user-edit.component").then(
            (c) => c.UserEditComponent
          ),
      },
    ],
  },
];
```

#### 2. Modern Standalone Component Example

```typescript
// dashboard.component.ts
import { Component, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <h1>Dashboard</h1>
    <p>Welcome to your dashboard!</p>

    <nav>
      <a routerLink="/dashboard/overview">Overview</a>
      <a routerLink="/dashboard/analytics">Analytics</a>
    </nav>

    <router-outlet></router-outlet>
  `,
})
export class DashboardComponent {
  private http = inject(HttpClient);
  userData = signal<any>(null);

  ngOnInit() {
    this.loadUserData();
  }

  private loadUserData() {
    this.http.get("/api/user-data").subscribe((data) => {
      this.userData.set(data);
    });
  }
}
```

---

### ESM Dynamic Import Patterns

**_Modern ES module patterns for lazy loading in Angular 19+_**

#### 1. Type-Safe Dynamic Imports

```typescript
// features/products/products.routes.ts
import { Routes } from "@angular/router";

// Type-safe route definitions
export const PRODUCTS_ROUTES: Routes = [
  {
    path: "",
    loadComponent: async () => {
      const { ProductListComponent } = await import("./product-list.component");
      return ProductListComponent;
    },
  },
  {
    path: ":id",
    loadComponent: async () => {
      const { ProductDetailComponent } = await import(
        "./product-detail.component"
      );
      return ProductDetailComponent;
    },
  },
  {
    path: "create",
    loadComponent: async () => {
      const { ProductCreateComponent } = await import(
        "./product-create.component"
      );
      return ProductCreateComponent;
    },
    data: {
      requiresAuth: true,
    },
  },
];
```

#### 2. Advanced Import Patterns

```typescript
// features/admin/admin.routes.ts
export const ADMIN_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./admin-dashboard.component")
        .then((m) => m.AdminDashboardComponent)
        .catch(() =>
          import("./admin-fallback.component").then(
            (m) => m.AdminFallbackComponent
          )
        ),
  },
  {
    path: "users",
    loadComponent: () =>
      import("./user-management.component").then(
        (m) => m.UserManagementComponent
      ),
    providers: [UserService], // Component-scoped providers
  },
];

// Conditional loading based on feature flags
export const getFeatureRoutes = (): Routes => {
  const routes: Routes = [
    {
      path: "standard",
      loadComponent: () =>
        import("./standard-feature.component").then(
          (m) => m.StandardFeatureComponent
        ),
    },
  ];

  // Add premium features if enabled
  if (environment.features.premium) {
    routes.push({
      path: "premium",
      loadComponent: () =>
        import("./premium-feature.component").then(
          (m) => m.PremiumFeatureComponent
        ),
    });
  }

  return routes;
};
```

#### 3. Webpack Magic Comments (Named Chunks)

```typescript
// Named chunks for better debugging and caching
export const routes: Routes = [
  {
    path: "reports",
    loadComponent: () =>
      import(
        /* webpackChunkName: "reports" */
        "./features/reports/reports.component"
      ).then((m) => m.ReportsComponent),
  },
  {
    path: "analytics",
    loadChildren: () =>
      import(
        /* webpackChunkName: "analytics-module" */
        "./features/analytics/analytics.routes"
      ).then((m) => m.ANALYTICS_ROUTES),
  },
];
```

---

### Signals Integration with Routing

**_Using Angular Signals with modern routing_**

#### 1. Signal-Based Route Data

```typescript
// product-detail.component.ts
import { Component, inject, signal, computed } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
  standalone: true,
  template: `
    <h1>Product {{ productId() }}</h1>
    <p>Product Name: {{ productName() }}</p>

    @if (isLoading()) {
    <p>Loading...</p>
    } @if (product()) {
    <div>
      <h2>{{ product()!.name }}</h2>
      <p>Price: {{ product()!.price }}</p>
    </div>
    }
  `,
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Convert route params to signals
  routeParams = toSignal(this.route.paramMap);
  queryParams = toSignal(this.route.queryParamMap);
  routeData = toSignal(this.route.data);

  // Computed signals from route data
  productId = computed(() => this.routeParams()?.get("id"));
  productName = computed(() => this.queryParams()?.get("name"));

  // Component state with signals
  product = signal<any>(null);
  isLoading = signal(false);

  async ngOnInit() {
    const id = this.productId();
    if (id) {
      await this.loadProduct(id);
    }
  }

  private async loadProduct(id: string) {
    this.isLoading.set(true);
    // Simulate API call
    setTimeout(() => {
      this.product.set({
        id: id,
        name: `Product ${id}`,
        price: 99.99,
      });
      this.isLoading.set(false);
    }, 1000);
  }
}
```

#### 2. Reactive Route Guards with Signals

```typescript
// auth.guard.ts - Modern guard with signals
import { inject } from "@angular/core";
import { CanMatchFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";

export const authGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Use signal-based authentication state
  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login with return URL
  router.navigate(["/login"], {
    queryParams: { returnUrl: segments.join("/") },
  });
  return false;
};

// Role-based guard with signals
export const roleGuard = (allowedRoles: string[]): CanMatchFn => {
  return () => {
    const authService = inject(AuthService);
    const userRoles = authService.currentUser()?.roles || [];

    return allowedRoles.some((role) => userRoles.includes(role));
  };
};
```

#### 3. Signal-Based Route Configuration

```typescript
// features/dashboard/dashboard.routes.ts
import { Routes } from "@angular/router";
import { inject } from "@angular/core";
import { PermissionsService } from "../../services/permissions.service";

// Dynamic routes based on user permissions
export const getDashboardRoutes = (): Routes => {
  const permissionsService = inject(PermissionsService);
  const baseRoutes: Routes = [
    {
      path: "",
      loadComponent: () =>
        import("./dashboard-home.component").then(
          (m) => m.DashboardHomeComponent
        ),
    },
  ];

  // Add admin routes if user has permission
  if (permissionsService.canAccessAdmin()) {
    baseRoutes.push({
      path: "admin",
      loadComponent: () =>
        import("./admin-panel.component").then((m) => m.AdminPanelComponent),
    });
  }

  // Add analytics if feature enabled
  if (permissionsService.canViewAnalytics()) {
    baseRoutes.push({
      path: "analytics",
      loadComponent: () =>
        import("./analytics-dashboard.component").then(
          (m) => m.AnalyticsDashboardComponent
        ),
    });
  }

  return baseRoutes;
};
```

---

### Performance Optimizations

**_Angular 19+ specific performance enhancements_**

#### 1. Deferrable Views (@defer)

```typescript
// Using @defer for component-level lazy loading
import { Component } from "@angular/core";

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Product Page</h1>

    <!-- Lazy load heavy components -->
    @defer (on viewport) {
    <app-product-recommendations />
    } @placeholder {
    <div>Loading recommendations...</div>
    } @loading (minimum 1s) {
    <div>Loading recommendations...</div>
    } @error {
    <div>Failed to load recommendations</div>
    }

    <!-- Lazy load on interaction -->
    @defer (on interaction) {
    <app-product-reviews />
    } @placeholder {
    <button>Load Reviews</button>
    }

    <!-- Lazy load on timer -->
    @defer (on timer(2s)) {
    <app-related-products />
    }
  `,
})
export class ProductPageComponent {}
```

#### 2. Modern Preloading Strategies

```typescript
// custom-preloading.service.ts
import { Injectable, inject } from "@angular/core";
import { PreloadingStrategy, Route } from "@angular/router";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class NetworkAwarePreloadingStrategy implements PreloadingStrategy {
  private connection = inject(ConnectionService);

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Skip preloading on slow connections
    if (this.connection.isSlow()) {
      return of(null);
    }

    // Preload based on route data
    if (route.data?.["preload"] === true) {
      return load();
    }

    return of(null);
  }
}

// Usage in app.config.ts
provideRouter(routes, withPreloading(NetworkAwarePreloadingStrategy));
```

#### 3. Lazy Loading with Providers

```typescript
// features/checkout/checkout.routes.ts
export const CHECKOUT_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./checkout.component").then((m) => m.CheckoutComponent),
    providers: [
      // Component-scoped services
      CheckoutService,
      PaymentService,
      { provide: API_CONFIG, useValue: environment.checkoutApi },
    ],
  },
];
```

---

### Advanced Patterns & Best Practices

**_Professional patterns for enterprise Angular 19+ applications_**

#### 1. Micro-Frontend Ready Architecture

```typescript
// features/products/products.config.ts
import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { PRODUCTS_ROUTES } from "./products.routes";

export const productsConfig: ApplicationConfig = {
  providers: [
    provideRouter(PRODUCTS_ROUTES),
    ProductService,
    // Feature-specific providers
  ],
};

// Module federation ready
export default productsConfig;
```

#### 2. Error Boundaries for Lazy Loading

```typescript
// error-boundary.component.ts
import { Component, ErrorHandler, inject } from "@angular/core";

@Component({
  standalone: true,
  template: `
    @if (!hasError) {
    <ng-content></ng-content>
    } @else {
    <div class="error">
      <h3>Something went wrong</h3>
      <button (click)="reload()">Try Again</button>
    </div>
    }
  `,
})
export class ErrorBoundaryComponent {
  private errorHandler = inject(ErrorHandler);
  hasError = false;

  constructor() {
    // Global error handling for lazy loading failures
    window.addEventListener("error", (event) => {
      if (event.error?.message?.includes("Loading chunk")) {
        this.hasError = true;
        this.errorHandler.handleError(event.error);
      }
    });
  }

  reload() {
    window.location.reload();
  }
}
```

#### 3. Advanced Route Configuration

```typescript
// features/admin/admin.routes.ts
import { Routes } from "@angular/router";
import { inject } from "@angular/core";
import { PermissionService } from "../../services/permission.service";

// Factory function for dynamic routes
export const createAdminRoutes = (): Routes => {
  const permissionService = inject(PermissionService);

  const baseRoutes: Routes = [
    {
      path: "",
      loadComponent: () =>
        import("./admin-dashboard.component").then(
          (m) => m.AdminDashboardComponent
        ),
    },
  ];

  // Add routes based on permissions
  if (permissionService.has("user_management")) {
    baseRoutes.push({
      path: "users",
      loadComponent: () =>
        import("./user-management.component").then(
          (m) => m.UserManagementComponent
        ),
    });
  }

  if (permissionService.has("content_management")) {
    baseRoutes.push({
      path: "content",
      loadComponent: () =>
        import("./content-management.component").then(
          (m) => m.ContentManagementComponent
        ),
    });
  }

  return baseRoutes;
};

export const ADMIN_ROUTES = createAdminRoutes();
```

#### 4. Performance Monitoring

```typescript
// performance-monitor.service.ts
import { Injectable, inject } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class PerformanceMonitorService {
  private router = inject(Router);

  initialize() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.measureLazyLoadingPerformance();
      });
  }

  private measureLazyLoadingPerformance() {
    // Measure and report lazy loading performance
    const navigationTiming = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    const resourceTimings = performance.getEntriesByType("resource");

    console.log("Lazy loading performance:", {
      navigationTiming,
      lazyChunks: resourceTimings.filter((r) => r.name.includes("chunk")),
    });
  }
}
```

### 5. Best Practices Summary

#### ✅ DO:

- Use `loadComponent` for standalone components
- Implement proper error boundaries
- Use signals for reactive route data
- Leverage `@defer` for component-level lazy loading
- Monitor bundle sizes with Angular DevTools
- Use type-safe dynamic imports

#### ❌ DON'T:

- Mix NgModules and standalone unnecessarily
- Forget error handling for lazy loading failures
- Lazy load critical above-the-fold content
- Ignore bundle size monitoring
- Use string-based routes without type safety

### 6. Angular 19+ Specific Tips

```typescript
// Use new Angular 19+ features
export const routes: Routes = [
  {
    path: "modern",
    loadComponent: () =>
      import("./modern-feature.component").then(
        (m) => m.ModernFeatureComponent
      ),
    // New data property for enhanced type safety
    data: {
      feature: "modern" as const,
      version: "2.0",
    },
  },
];

// Enhanced type safety with route data
declare module "@angular/router" {
  interface RouteData {
    feature?: string;
    version?: string;
    preload?: boolean;
  }
}
```
