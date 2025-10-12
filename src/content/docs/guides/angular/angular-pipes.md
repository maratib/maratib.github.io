---
title: Angular Pipes
slug: guides/angular/angular-pipes
description: Angular Pipes
sidebar:
  order: 6
---

- **Pipes** are `simple functions` that `transform input values to output values for display in templates`.
- They are `used in template expressions` to `format data`.

### Pure vs Impure Pipes - Key Differences

| Aspect      | Pure Pipe                           | Impure Pipe                            |
| ----------- | ----------------------------------- | -------------------------------------- |
| Execution   | Only on pure change                 | Every change detection                 |
| Performance | Optimized                           | Potentially slow                       |
| Use Case    | Primitive values, immutable objects | Arrays/objects with internal mutations |
| State       | Stateless                           | Can be stateful                        |

<details>
<summary>Built-in Pipes</summary>

```typescript
// Template usage
{{ value | pipeName:parameter }}

// Examples with built-in pipes
{{ user.name | uppercase }}  // JOHN
{{ user.salary | currency:'USD' }}  // $50,000.00
{{ user.birthday | date:'mediumDate' }}  // Jan 1, 2023
{{ user.description | slice:0:100 }}  // First 100 characters
{{ items | array | json }}  // JSON representation
```

</details>

<details>
<summary>Pure Pipes (Default)</summary>

```typescript
@Pipe({
  name: "pureExample",
  pure: true, // Default, can be omitted
})
export class PureExamplePipe implements PipeTransform {
  transform(value: string): string {
    console.log("Pure pipe executed");
    return value.toUpperCase();
  }
}

// Usage - only runs when 'name' reference changes
{
  {
    name | pureExample;
  }
}
```

</details>

<details>
<summary>Impure Pipes</summary>

```typescript
@Pipe({
  name: "impureExample",
  pure: false, // Explicitly set to false
})
export class ImpureExamplePipe implements PipeTransform {
  transform(value: any[]): any[] {
    console.log("Impure pipe executed - runs frequently!");
    return value.filter((item) => item.active);
  }
}

// Usage - runs on every change detection
{
  {
    items | impureExample;
  }
}
```

</details>

<details>
<summary>Creating Custom Pipes</summary>

### 1. Basic Custom Pipe

```typescript
// reverse.pipe.ts
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "reverse",
})
export class ReversePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    return value.split("").reverse().join("");
  }
}

// Usage
{
  {
    "hello" | reverse;
  }
} // Output: "olleh"
```

### 2. Pipe with Parameters

```typescript
// truncate.pipe.ts
@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50, suffix: string = '...'): string {
    if (!value) return value;
    if (value.length <= limit) return value;

    return value.substring(0, limit) + suffix;
  }
}

// Usage
{{ longText | truncate:100:'...' }}
{{ longText | truncate:50 }}  // Uses default suffix
{{ longText | truncate }}      // Uses both defaults
```

### 3. Pure Pipe Example (Recommended)

```typescript
// filter.pipe.ts
@Pipe({
  name: 'filter',
  pure: true  // Default behavior
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchTerm: string, property: string = 'name'): any[] {
    if (!items || !searchTerm) return items;

    return items.filter(item =>
      item[property].toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}

// Usage
<div *ngFor="let user of users | filter:searchText:'email'">
  {{ user.name }}
</div>
```

### 4. Impure Pipe Example (Use Carefully)

```typescript
// sort.pipe.ts
@Pipe({
  name: 'sort',
  pure: false  // Needed for array sorting
})
export class SortPipe implements PipeTransform {
  transform(items: any[], field: string = 'name', order: 'asc' | 'desc' = 'asc'): any[] {
    if (!items || !Array.isArray(items)) return items;

    return [...items].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (order === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
  }
}

// Usage - updates when array items change
<div *ngFor="let user of users | sort:'name':'asc'">
  {{ user.name }}
</div>
```

### 5. Async Data Pipe

```typescript
// safe.pipe.ts
@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, type: 'html' | 'url' | 'resourceUrl' = 'html'): any {
    if (!value) return value;

    switch (type) {
      case 'html': return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'url': return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'resourceUrl': return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      default: return value;
    }
  }
}

// Usage for dangerous HTML
<div [innerHTML]="userBio | safe:'html'"></div>
```

### 6. Currency Format Pipe

```typescript
// custom-currency.pipe.ts
@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(
    value: number,
    currencyCode: string = 'USD',
    display: 'symbol' | 'code' | 'name' = 'symbol',
    digits: string = '1.2-2'
  ): string {
    if (value == null) return '';

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return formatter.format(value);
  }
}

// Usage
{{ price | customCurrency:'EUR':'symbol' }}
{{ price | customCurrency:'USD' }}
```

### 7. File Size Pipe

```typescript
// file-size.pipe.ts
@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {
  transform(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}

// Usage
{{ file.size | fileSize }}        // 1.45 MB
{{ file.size | fileSize:1 }}      // 1.4 MB
```

</details>

<details>
<summary>Registering Pipes</summary>
#### Module Registration

```typescript
// app.module.ts
import { NgModule } from "@angular/core";
import { ReversePipe, TruncatePipe, FilterPipe } from "./pipes";

@NgModule({
  declarations: [ReversePipe, TruncatePipe, FilterPipe],
  exports: [
    // Export if used in other modules
    ReversePipe,
    TruncatePipe,
    FilterPipe,
  ],
})
export class AppModule {}
```

### Standalone Component Registration (Angular 14+)

```typescript
// For standalone components
@Component({
  standalone: true,
  imports: [ReversePipe, CommonModule],
  template: `{{ text | reverse }}`,
})
export class MyComponent {}
```

</details>

<details>
<summary>Best Practices</summary>

### 1. Prefer Pure Pipes

```typescript
// ✅ Good - Pure pipe
@Pipe({ name: "calculate" })
export class CalculatePipe implements PipeTransform {
  transform(value: number, multiplier: number): number {
    return value * multiplier;
  }
}

// ❌ Avoid - Impure unless necessary
@Pipe({ name: "filterArray", pure: false })
export class FilterArrayPipe implements PipeTransform {
  transform(items: any[]) {
    return items.filter((item) => item.active); // Runs frequently!
  }
}
```

### 2. Use Methods for Complex Logic

```typescript
// ❌ Don't put heavy logic in pipes (runs often)
{{ data | heavyCalculation }}

// ✅ Better - Compute in component
// component.ts
get calculatedData() {
  return this.heavyCalculation(this.data);
}

// template.html
{{ calculatedData }}
```

### 3. Chain Pipes Properly

```typescript
// ✅ Good - Chaining pipes
{{ user.name | uppercase | truncate:20 }}

// Execution order: uppercase → truncate
```

### 4. Handle Null Values

```typescript
@Pipe({ name: "safeDisplay" })
export class SafeDisplayPipe implements PipeTransform {
  transform(value: any): string {
    // Always handle null/undefined
    if (value == null) return "-";
    if (value === "") return "Empty";

    return value.toString();
  }
}
```

</details>

<details>
<summary>Performance Considerations</summary>

### Pure Pipe Optimization

```typescript
@Pipe({ name: "expensive", pure: true })
export class ExpensivePipe implements PipeTransform {
  // Cache results for same inputs
  private cache = new Map<string, any>();

  transform(value: string, param: number): any {
    const key = `${value}-${param}`;

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const result = this.expensiveOperation(value, param);
    this.cache.set(key, result);

    return result;
  }

  private expensiveOperation(value: string, param: number) {
    // Heavy computation here
    return computedResult;
  }
}
```

</details>

<details>
<summary>Testing Pipes</summary>

```typescript
// reverse.pipe.spec.ts
import { ReversePipe } from "./reverse.pipe";

describe("ReversePipe", () => {
  let pipe: ReversePipe;

  beforeEach(() => {
    pipe = new ReversePipe();
  });

  it("should reverse a string", () => {
    expect(pipe.transform("hello")).toBe("olleh");
  });

  it("should handle empty string", () => {
    expect(pipe.transform("")).toBe("");
  });

  it("should handle null", () => {
    expect(pipe.transform(null)).toBeNull();
  });
});
```

</details>

### Summary

**When to use Pipes:**

- Simple data transformations for display
- Formatting dates, currencies, text
- Filtering/sorting small datasets

**When NOT to use Pipes:**

- Heavy computations (use component methods)
- Complex business logic (use services)
- Large dataset operations (do it in component)

**Pure vs Impure:**

- **Use Pure** (default) for most cases - better performance
- **Use Impure** only when you need to detect changes within arrays/objects
- **Be careful** with impure pipes - they run frequently!

_Pipes are powerful for template data transformation but should be used judiciously to maintain performance._
