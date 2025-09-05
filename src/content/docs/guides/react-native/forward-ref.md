---
title: ForwardRef Guide
description: ForwardRef Guide
---

*   **forwardRef:** A utility function from React that allows a component to receive a `ref` from a parent and pass it down to a child component further down the render tree.



```javascript

import { forwardRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

type ButtonProps = {
  title?: string;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(({ title, ...touchableProps }, ref) => {
  return (
    <TouchableOpacity ref={ref} {...touchableProps} style={[styles.button, touchableProps.style]}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
});

---
// Use of Button
 <Button  
  onPress={() => navigation.navigate('Details', { name: 'Dan',})} 
  title="Show Details" 
 />

```

#### Line-by-Line Breakdown


---

```typescript
type ButtonProps = {
  title?: string;
} & TouchableOpacityProps;
```
*   **Purpose:** Defines the TypeScript interface (type) for the component's props.
*   **`title?: string;`:** A prop specific to our custom `Button`. It's optional (`?`) and will be the text displayed inside the button.
*   **`& TouchableOpacityProps`:** This uses TypeScript's intersection type to combine our custom `title` prop with *all* the props that a standard `TouchableOpacity` accepts (like `onPress`, `disabled`, `style`, `accessibilityLabel`, etc.). This is a powerful pattern that makes our custom component highly extensible.

---

```typescript
export const Button = forwardRef<View, ButtonProps>(({ title, ...touchableProps }, ref) => {
```
*   **Purpose:** Creates and exports the Button component using `forwardRef`.
*   **`forwardRef<View, ButtonProps>(...)`:** This is the function call. It takes two generic type parameters:
    1.  **`<View>`:** The type of the element the `ref` will point to. Here, it's `View` because `TouchableOpacity` is a wrapper that ultimately renders a native view. This means the parent's `ref` will have access to all methods of a `View` component (e.g., `.measure()`).
    2.  **`<ButtonProps>`:** The type of the props the component expects.
*   **`({ title, ...touchableProps }, ref) => {`:** This is the render function passed to `forwardRef`.
    *   It receives two arguments:
        1.  **`props`:** Destructured into `title` (our custom prop) and `...touchableProps` (all other props, which are the `TouchableOpacityProps`).
        2.  **`ref`:** The `ref` passed down from the parent component. This argument is **only present** because we wrapped the component in `forwardRef`.

---

```typescript
  return (
    <TouchableOpacity ref={ref} {...touchableProps} style={[styles.button, touchableProps.style]}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
});
```
*   **Purpose:** Renders the JSX for the component.
*   **`<TouchableOpacity ref={ref} {...touchableProps} style={[styles.button, touchableProps.style]}>`**
    *   **`ref={ref}`:** **This is the most crucial line.** It takes the `ref` we received from the parent and attaches it directly to the `TouchableOpacity` component. This connects the parent's `ref` to the actual native element.
    *   **`{...touchableProps}`:** Spreads all the remaining props (like `onPress`, `disabled`) onto the `TouchableOpacity`. This is what gives the component its extensibility.
    *   **`style={[styles.button, touchableProps.style]}`:** Merges the base styles from `styles.button` with any `style` prop passed in from the parent. The parent's `style` will override the base styles if there are conflicts, which is the expected behavior.

---

```typescript
const styles = StyleSheet.create({
  button: {
    // ... base button styles (e.g., padding, backgroundColor, borderRadius)
  },
  buttonText: {
    // ... base text styles (e.g., color, fontSize, fontWeight)
  },
});
```
*   **Purpose:** Defines the base styles for the component using React Native's `StyleSheet`.

---

### Significance of `forwardRef` in this Context

Using `forwardRef` is essential here for several reasons:

1.  **Direct Access:** It allows parent components to directly access the underlying `TouchableOpacity` (and hence the native view) instance. Without it, a `ref` passed to `<Button ref={myRef} />` would be attached to the `Button` function component itself, which doesn't hold a native element and is therefore useless for most `ref` operations.

2.  **Common Use Cases with `ref`:**
    *   **Focus Management:** A parent component (e.g., a form) might want to call `.focus()` on the next input. If your `Button` was focusable, you'd need a `ref` to control it.
    *   **Animations:** Starting an animation on the button from a parent (e.g., a shake animation for an invalid submit). This often requires a `ref` to the native element to use with Animated API.
    *   **Measuring Layout:** Programmatically getting the button's position or dimensions on screen using `ref.measure()` for tasks like rendering a tooltip nearby or scrolling to its position.
    *   **Integrating with Native Libraries:** Some third-party libraries might require a `ref` to a native component to function properly.

3.  **Reusability and Predictability:** It makes the custom `Button` component behave like a built-in component. Developers expect to be able to set a `ref` on a button, and `forwardRef` ensures this expectation is met.

### Alternative Ways to Achieve the Same Functionality

Yes, there are alternatives, but they are generally considered inferior for this use case.

1.  **Using a Different Prop Name (e.g., `innerRef`):**
    ```typescript
    type ButtonProps = {
      title?: string;
      innerRef?: React.Ref<View>;
    } & TouchableOpacityProps;

    export const Button = ({ title, innerRef, ...touchableProps }: ButtonProps) => {
      return (
        <TouchableOpacity ref={innerRef} {...touchableProps} style={[styles.button, touchableProps.style]}>
          <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
      );
    };

    // Usage: <Button title="Press" innerRef={myRef} />
    ```
    *   **Drawback:** This breaks the standard React convention. Developers expect to use the prop named `ref`. This makes the API less intuitive and inconsistent with the rest of the React ecosystem.

2.  **Not Supporting `ref` at All:**
    *   You simply don't accept a `ref` and don't forward it.
    *   **Drawback:** This severely limits the component's functionality for the advanced use cases mentioned above (animations, measuring, etc.). The component is less reusable and powerful.

3.  **Using a Class Component (Legacy):**
    *   Before `forwardRef` was introduced in React 16.3, you could only attach a `ref` to a class component. While this would work, it's an outdated pattern. Functional components with hooks and `forwardRef` are the modern, recommended way to build React components.

### Conclusion

The use of `forwardRef` in this custom Button component is **the correct and idiomatic React pattern**. It provides a clean, standard API for consumers of the component while enabling powerful imperative functionalities. The alternative approaches are workarounds that introduce API inconsistencies or reduce functionality. **`forwardRef` is the best way to handle this requirement.**