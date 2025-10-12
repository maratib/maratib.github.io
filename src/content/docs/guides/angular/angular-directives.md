---
title: Angular Directives
slug: guides/angular/angular-directives
description: Angular Directives
sidebar:
  order: 1
---

### Directives

- **Directives** are **`fundamental building blocks`** that allow you to **`manipulate the DOM`**.

- **Directives** add **`new behavior`** to existing elements or **`modify`** their **`structure`**.

- Every directive is marked with the **`@Directive()`** decorator.

- There are **`three`** main **`types`** of **`directives`** in Angular:

- **`Component Directives`**, **`Structural Directives`** **`Attribute Directives`**

### 1\. Component Directives

- A **Component** is a directive with a **template**, uses **@Component** decorator.

- This is the `most common type of directive` you'll use.
- All Angular UI elements are built as components.

<details>
<summary>Component Example:</summary>

```typescript
import { Component } from "@angular/core";

@Component({
  selector: "app-user-card", // How you use it in HTML
  templateUrl: "./user-card.component.html", // Its dedicated template
  styleUrls: ["./user-card.component.css"],
})
export class UserCardComponent {
  // Component logic
  userName = "Jane Doe";
}

// Used in template as
<app-user-card></app-user-card>>
```

</details>

### 2\. Structural Directives

- **Structural Directives** are responsible for **`shaping or reshaping the DOM's structure`**

- Typically by **`adding`**, **`removing`**, or **`manipulating`** elements.

- Built-in Structural Directives (**`*ngIf`**, **`*ngFor`**, **`*ngSwitch`** or **`@if`**, **`@for`**, **`@switch`**)

<details>
<summary>Creating Custom Structural Directives</summary>

You can create a custom structural directive to implement reusable structural logic. This involves injecting two key classes:

1.  **`TemplateRef`**: Represents the element's content that the directive is attached to (the element _without_ the directive's attribute).
2.  **`ViewContainerRef`**: Represents the "anchor" location where you can embed the template.

**Conceptual Process:**

1.  Get the template content (`TemplateRef`).
2.  Decide where in the DOM to render it (`ViewContainerRef`).
3.  Use methods like `viewContainer.createEmbeddedView(templateRef)` to show the element, or simply do nothing to hide/remove it.

**Example (Simplified `*ngUnless`):**
A custom directive that shows the element **unless** a condition is true (opposite of `*ngIf`).

```typescript
import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";

@Directive({ selector: "[appUnless]" })
export class UnlessDirective {
  private hasView = false;

  // The setter runs whenever the input property changes
  @Input() set appUnless(condition: boolean) {
    if (!condition && !this.hasView) {
      // Create the view (show the element)
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (condition && this.hasView) {
      // Clear the view (remove the element)
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}
}
```

**Usage:** `<div *appUnless="isValid">This will show if isValid is false.</div>`

</details>

### 3\. Attribute Directives

- **Attribute Directives** are responsible for **`changing the appearance or behavior of an element, component, or another directive`** by modifying its properties.

- They **`do not add or remove elements`** from the **`DOM`**.
- Built-in Attribute Directives (**`[ngClass]`**, **`[ngStyle]`**, **`ngModel`**)

<details>
<summary>Creating Custom Attribute Directives</summary>

You create a custom attribute directive using the `@Directive()` decorator and typically inject the **`ElementRef`** and optionally **`Renderer2`** services.

1.  **`ElementRef`**: Gives you direct access to the host DOM element, allowing you to manipulate it.
2.  **`Renderer2`**: The preferred, safer way to manipulate the DOM, as it abstracts away direct DOM access, which can be useful when Angular is running in a non-browser environment (like server-side rendering).

**Example (Simplified `appHighlight`):**
A custom directive that highlights the element it is attached to.

```typescript
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from "@angular/core";

@Directive({
  selector: "[appHighlight]", // Used as an attribute on an element
})
export class HighlightDirective {
  // Input property to allow setting a custom highlight color
  @Input() highlightColor: string = "yellow";

  constructor(private el: ElementRef, private renderer: Renderer2) {
    // You could also apply the style here, but using HostListener is more common for interactive changes.
  }

  // Use @HostListener to react to events on the host element
  @HostListener("mouseenter") onMouseEnter() {
    this.changeColor(this.highlightColor);
  }

  @HostListener("mouseleave") onMouseLeave() {
    this.changeColor(null);
  }

  private changeColor(color: string | null) {
    // Renderer2 is the recommended way to manipulate the DOM
    this.renderer.setStyle(this.el.nativeElement, "background-color", color);
  }
}
```

**Usage:**

1.  Using the default color: `<p appHighlight>Highlight me</p>`
2.  Using a custom color: `<p appHighlight [highlightColor]="'green'">Highlight me green</p>`
</details>
