# Rules of React code quality

Just as different programming languages have their own ways of expressing concepts, React has its own idioms — or **rules** — for how to express patterns in a way that is easy to understand and yields high-quality applications.

This document is the **single source of truth** for writing React code in this project. When writing or reviewing code, follow these rules **A–Z, step by step**. Breaking them usually means bugs, unidiomatic code, and harder maintenance.

> To learn more about expressing UIs with React, read [Thinking in React](https://react.dev/learn/thinking-in-react).

---

## Quick rules (must follow when writing code)

When writing or editing React code in this project, follow this document **A–Z**. Do not skip rules for convenience.

### Must follow (blocking)

1. **Pure Components & Hooks** — same props/state/context → same output; no side effects in render.
2. **Immutable data** — never mutate props, state, Hook arguments/returns, or values already passed to JSX.
3. **React calls components** — only `<Component />` in JSX; never `Component()`.
4. **Hooks rules** — top level only; only in function components / custom Hooks; never pass Hooks as values.
5. **Effect/ref cleanup** — every subscribe/timer/connection/ref registration cleans up.
6. **One abstraction level** — page/components orchestrate; extract fetch/normalize/domain helpers.
7. **Readable, small units** — clear names, no magic numbers/strings, single responsibility.
8. **Errors** — try/catch for async; ErrorBoundary for critical UI; user-facing failure feedback.
9. **Standards** — match ESLint/Prettier; reuse config/ROUTES/shared patterns already in the repo.
10. **Strict Mode** — keep root `<StrictMode>` in `src/index.jsx`; fix double-render/effect bugs it reveals.

### Prefer

- Event handlers over Effects when possible
- Custom hooks for reusable stateful logic
- Named constants for retries, timeouts, routes, limits
- Lazy/code-split heavy pages (existing webpack splitChunks)

If a change would violate any rule above, refactor first — do not ship impure or unidiomatic React.

---

## Table of contents

1. [Overview — Rules of React](#1-overview--rules-of-react)
2. [Components and Hooks must be pure](#2-components-and-hooks-must-be-pure)
3. [React calls Components and Hooks](#3-react-calls-components-and-hooks)
4. [Rules of Hooks](#4-rules-of-hooks)
5. [Strict Mode](#5-strict-mode)
6. [Code quality (10 principles)](#6-code-quality-10-principles)
7. [One level of abstraction per function](#7-one-level-of-abstraction-per-function)
8. [Project checklist (A–Z)](#8-project-checklist-az)

---

## 1. Overview — Rules of React

This section describes the rules you need to follow to write idiomatic React code. Writing idiomatic React code can help you write well organized, safe, and composable applications. These properties make your app more resilient to changes and make it easier to work with other developers, libraries, and tools.

These rules are known as the **Rules of React**. They are rules — and not just guidelines — in the sense that if they are broken, your app likely has bugs. Your code also becomes unidiomatic and harder to understand and reason about.

We strongly recommend using **Strict Mode** alongside React’s **ESLint plugin** (`eslint-plugin-react-hooks`) to help your codebase follow the Rules of React. By following the Rules of React, you’ll be able to find and address these bugs and keep your application maintainable.

### Core pillars

| Pillar | Summary |
|--------|---------|
| **Components and Hooks must be pure** | Idempotent render, no side effects in render, immutable props/state/hook args/JSX values |
| **React calls Components and Hooks** | Never call components as functions; never pass Hooks around as values |
| **Rules of Hooks** | Only call Hooks at the top level; only from React functions |

---

## 2. Components and Hooks must be pure

Purity in Components and Hooks is a key rule of React that makes your app predictable, easy to debug, and allows React to automatically optimize your code.

### 2.1 Why purity matters

One of the key concepts that makes React, React is purity. A pure component or hook is one that is:

- **Idempotent** — You always get the same result every time you run it with the same inputs — props, state, context for component inputs; and arguments for hook inputs.
- **Has no side effects in render** — Code with side effects should run separately from rendering. For example as an event handler — where the user interacts with the UI and causes it to update; or as an Effect — which runs after render.
- **Does not mutate non-local values** — Components and Hooks should never modify values that aren’t created locally in render.

When render is kept pure, React can understand how to prioritize which updates are most important for the user to see first. This is made possible because of render purity: since components don’t have side effects in render, React can pause rendering components that aren’t as important to update, and only come back to them later when it’s needed.

Concretely, this means that rendering logic can be run multiple times in a way that allows React to give your user a pleasant user experience. However, if your component has an untracked side effect — like modifying the value of a global variable during render — when React runs your rendering code again, your side effects will be triggered in a way that won’t match what you want. This often leads to unexpected bugs that can degrade how your users experience your app.

### 2.2 How React runs your code

React is declarative: you tell React what to render, and React will figure out how best to display it to your user. To do this, React has a few phases where it runs your code. You don’t need to know about all of these phases to use React well. But at a high level, you should know about what code runs in **render**, and what runs **outside** of it.

**Rendering** refers to calculating what the next version of your UI should look like. After rendering, React takes this new calculation and compares it to the calculation used to create the previous version of your UI. Then React **commits** just the minimum changes needed to the DOM (what your user actually sees) to apply the changes. Finally, **Effects** are flushed (meaning they are run until there are no more left).

### 2.3 Components must be idempotent

React components are assumed to always return the same output with respect to their inputs — props, state, and context.

This means that all code that runs during render must also be idempotent in order for this rule to hold. For example, this line of code is not idempotent (and therefore, neither is the component):

```jsx
function Clock() {
  const time = new Date(); // 🔴 Bad: always returns a different result!
  return <span>{time.toLocaleString()}</span>;
}
```

`new Date()` is not idempotent as it always returns the current date and changes its result every time it’s called. When you render the above component, the time displayed on the screen will stay stuck on the time that the component was rendered. Similarly, functions like `Math.random()` also aren’t idempotent, because they return different results every time they’re called, even when the inputs are the same.

This doesn’t mean you shouldn’t use non-idempotent functions like `new Date()` at all — you should just avoid using them during render. In this case, we can synchronize the latest date to this component using an Effect:

```jsx
import { useState, useEffect } from 'react';

function useTime() {
  // 1. Keep track of the current date's state. `useState` receives an initializer function as its
  //    initial state. It only runs once when the hook is called, so only the current date at the
  //    time the hook is called is set first.
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    // 2. Update the current date every second using `setInterval`.
    const id = setInterval(() => {
      setTime(new Date()); // ✅ Good: non-idempotent code no longer runs in render
    }, 1000);
    // 3. Return a cleanup function so we don't leak the `setInterval` timer.
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function Clock() {
  const time = useTime();
  return <span>{time.toLocaleString()}</span>;
}
```

By wrapping the non-idempotent `new Date()` call in an Effect, it moves that calculation outside of rendering.

If you don’t need to synchronize some external state with React, you can also consider using an event handler if it only needs to be updated in response to a user interaction.

### 2.4 Side effects must run outside of render

Side effects should not run in render, as React can render components multiple times to create the best possible user experience.

> **Note:** Side effects are a broader term than Effects. Effects specifically refer to code that’s wrapped in `useEffect`, while a side effect is a general term for code that has any observable effect other than its primary result of returning a value to the caller.

Side effects are typically written inside of **event handlers** or **Effects**. But never during render.

While render must be kept pure, side effects are necessary at some point in order for your app to do anything interesting, like showing something on the screen! The key point of this rule is that side effects should not run in render, as React can render components multiple times. In most cases, you’ll use event handlers to handle side effects. Using an event handler explicitly tells React that this code doesn’t need to run during render, keeping render pure. If you’ve exhausted all options — and only as a last resort — you can also handle side effects using `useEffect`.

### 2.5 When is it okay to have mutation?

#### Local mutation

One common example of a side effect is mutation, which in JavaScript refers to changing the value of a non-primitive value. In general, while mutation is not idiomatic in React, **local mutation is absolutely fine**:

```jsx
function FriendList({ friends }) {
  const items = []; // ✅ Good: locally created
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(<Friend key={friend.id} friend={friend} />); // ✅ Good: local mutation is okay
  }
  return <section>{items}</section>;
}
```

There is no need to contort your code to avoid local mutation. `Array.map` could also be used here for brevity, but there is nothing wrong with creating a local array and then pushing items into it during render.

Even though it looks like we are mutating `items`, the key point to note is that this code only does so locally — the mutation isn’t “remembered” when the component is rendered again. In other words, `items` only stays around as long as the component does. Because `items` is always recreated every time `<FriendList />` is rendered, the component will always return the same result.

On the other hand, if `items` was created outside of the component, it holds on to its previous values and remembers changes:

```jsx
const items = []; // 🔴 Bad: created outside of the component
function FriendList({ friends }) {
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(<Friend key={friend.id} friend={friend} />); // 🔴 Bad: mutates a value created outside of render
  }
  return <section>{items}</section>;
}
```

When `<FriendList />` runs again, we will continue appending friends to `items` every time that component is run, leading to multiple duplicated results. This version of `<FriendList />` has observable side effects during render and breaks the rule.

#### Lazy initialization

Lazy initialization is also fine despite not being fully “pure”:

```jsx
function ExpenseForm() {
  SuperCalculator.initializeIfNotReady(); // ✅ Good: if it doesn't affect other components
  // Continue rendering...
}
```

#### Changing the DOM

Side effects that are directly visible to the user are not allowed in the render logic of React components. In other words, merely calling a component function shouldn’t by itself produce a change on the screen.

```jsx
function ProductDetailPage({ product }) {
  document.title = product.title; // 🔴 Bad: Changes the DOM
}
```

One way to achieve the desired result of updating `document.title` outside of render is to synchronize the component with `document` (e.g. via an Effect).

As long as calling a component multiple times is safe and doesn’t affect the rendering of other components, React doesn’t care if it’s 100% pure in the strict functional programming sense of the word. It is more important that components must be **idempotent**.

### 2.6 Props and state are immutable

A component’s props and state are immutable snapshots with respect to a single render. Never mutate them directly. Instead, pass new props down, and use the setter function from `useState`.

You can think of the props and state values as snapshots that are updated after rendering. For this reason, you don’t modify the props or state variables directly: instead you pass new props, or use the setter function provided to you to tell React that state needs to update the next time the component is rendered.

#### Don’t mutate Props

Props are immutable because if you mutate them, the application will produce inconsistent output, which can be hard to debug as it may or may not work depending on the circumstances.

```jsx
function Post({ item }) {
  item.url = new Url(item.url, base); // 🔴 Bad: never mutate props directly
  return <Link url={item.url}>{item.title}</Link>;
}

function Post({ item }) {
  const url = new Url(item.url, base); // ✅ Good: make a copy instead
  return <Link url={url}>{item.title}</Link>;
}
```

#### Don’t mutate State

`useState` returns the state variable and a setter to update that state.

```jsx
const [stateVariable, setter] = useState(0);
```

Rather than updating the state variable in-place, we need to update it using the setter function that is returned by `useState`. Changing values on the state variable doesn’t cause the component to update, leaving your users with an outdated UI. Using the setter function informs React that the state has changed, and that we need to queue a re-render to update the UI.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    count = count + 1; // 🔴 Bad: never mutate state directly
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}

function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1); // ✅ Good: use the setter function returned by useState
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

### 2.7 Return values and arguments to Hooks are immutable

Once values are passed to a Hook, you should not modify them. Like props in JSX, values become immutable when passed to a Hook.

```jsx
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  if (icon.enabled) {
    icon.className = computeStyle(icon, theme); // 🔴 Bad: never mutate hook arguments directly
  }
  return icon;
}

function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  const newIcon = { ...icon }; // ✅ Good: make a copy instead
  if (icon.enabled) {
    newIcon.className = computeStyle(icon, theme);
  }
  return newIcon;
}
```

One important principle in React is **local reasoning**: the ability to understand what a component or hook does by looking at its code in isolation. Hooks should be treated like “black boxes” when they are called. For example, a custom hook might have used its arguments as dependencies to memoize values inside it:

```jsx
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);

  return useMemo(() => {
    const newIcon = { ...icon };
    if (icon.enabled) {
      newIcon.className = computeStyle(icon, theme);
    }
    return newIcon;
  }, [icon, theme]);
}
```

If you were to mutate the Hook’s arguments, the custom hook’s memoization will become incorrect, so it’s important to avoid doing that.

```jsx
style = useIconStyle(icon);         // `style` is memoized based on `icon`
icon.enabled = false;               // Bad: 🔴 never mutate hook arguments directly
style = useIconStyle(icon);         // previously memoized result is returned

style = useIconStyle(icon);         // `style` is memoized based on `icon`
icon = { ...icon, enabled: false }; // Good: ✅ make a copy instead
style = useIconStyle(icon);         // new value of `style` is calculated
```

Similarly, it’s important to not modify the return values of Hooks, as they may have been memoized.

### 2.8 Values are immutable after being passed to JSX

Don’t mutate values after they’ve been used in JSX. Move the mutation before the JSX is created.

When you use JSX in an expression, React may eagerly evaluate the JSX before the component finishes rendering. This means that mutating values after they’ve been passed to JSX can lead to outdated UIs, as React won’t know to update the component’s output.

```jsx
function Page({ colour }) {
  const styles = { colour, size: 'large' };
  const header = <Header styles={styles} />;
  styles.size = 'small'; // 🔴 Bad: styles was already used in the JSX above
  const footer = <Footer styles={styles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}

function Page({ colour }) {
  const headerStyles = { colour, size: 'large' };
  const header = <Header styles={headerStyles} />;
  const footerStyles = { colour, size: 'small' }; // ✅ Good: we created a new value
  const footer = <Footer styles={footerStyles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```

---

## 3. React calls Components and Hooks

React is responsible for rendering components and Hooks when necessary to optimize the user experience. It is declarative: you tell React what to render in your component’s logic, and React will figure out how best to display it to your user.

### 3.1 Never call component functions directly

Components should only be used in JSX. Don’t call them as regular functions. React should call it.

React must decide when your component function is called during rendering. In React, you do this using JSX.

```jsx
function BlogPost() {
  return (
    <Layout>
      <Article />
    </Layout>
  ); // ✅ Good: Only use components in JSX
}

function BlogPost() {
  return <Layout>{Article()}</Layout>; // 🔴 Bad: Never call them directly
}
```

If a component contains Hooks, it’s easy to violate the Rules of Hooks when components are called directly in a loop or conditionally.

Letting React orchestrate rendering also allows a number of benefits:

- **Components become more than functions.** React can augment them with features like local state through Hooks that are tied to the component’s identity in the tree.
- **Component types participate in reconciliation.** By letting React call your components, you also tell it more about the conceptual structure of your tree. For example, when you move from rendering `<Feed>` to the `<Profile>` page, React won’t attempt to re-use them.
- **React can enhance your user experience.** For example, it can let the browser do some work between component calls so that re-rendering a large component tree doesn’t block the main thread.
- **A better debugging story.** If components are first-class citizens that the library is aware of, we can build rich developer tools for introspection in development.
- **More efficient reconciliation.** React can decide exactly which components in the tree need re-rendering and skip over the ones that don’t. That makes your app faster and more snappy.

### 3.2 Never pass around Hooks as regular values

Hooks should only be called inside of components or Hooks. Never pass it around as a regular value.

Hooks allow you to augment a component with React features. They should always be called as a function, and never passed around as a regular value. This enables local reasoning, or the ability for developers to understand everything a component can do by looking at that component in isolation.

Breaking this rule will cause React to not automatically optimize your component.

### 3.3 Don’t dynamically mutate a Hook

Hooks should be as “static” as possible. This means you shouldn’t dynamically mutate them. For example, this means you shouldn’t write higher order Hooks:

```jsx
function ChatInput() {
  const useDataWithLogging = withLogging(useData); // 🔴 Bad: don't write higher order Hooks
  const data = useDataWithLogging();
}
```

Hooks should be immutable and not be mutated. Instead of mutating a Hook dynamically, create a static version of the Hook with the desired functionality.

```jsx
function ChatInput() {
  const data = useDataWithLogging(); // ✅ Good: Create a new version of the Hook
}

function useDataWithLogging() {
  // ... Create a new version of the Hook and inline the logic here
}
```

### 3.4 Don’t dynamically use Hooks

Hooks should also not be dynamically used: for example, instead of doing dependency injection in a component by passing a Hook as a value:

```jsx
function ChatInput() {
  return <Button useData={useDataWithLogging} />; // 🔴 Bad: don't pass Hooks as props
}
```

You should always inline the call of the Hook into that component and handle any logic in there.

```jsx
function ChatInput() {
  return <Button />;
}

function Button() {
  const data = useDataWithLogging(); // ✅ Good: Use the Hook directly
}

function useDataWithLogging() {
  // If there's any conditional logic to change the Hook's behavior, it should be inlined into
  // the Hook
}
```

This way, `<Button />` is much easier to understand and debug. When Hooks are used in dynamic ways, it increases the complexity of your app greatly and inhibits local reasoning, making your team less productive in the long term. It also makes it easier to accidentally break the Rules of Hooks that Hooks should not be called conditionally. If you find yourself needing to mock components for tests, it’s better to mock the server instead to respond with canned data. If possible, it’s also usually more effective to test your app with end-to-end tests.

---

## 4. Rules of Hooks

Hooks are defined using JavaScript functions, but they represent a special type of reusable UI logic with restrictions on where they can be called. You need to follow the Rules of Hooks when using them.

### 4.1 Only call Hooks at the top level

Functions whose names start with `use` are called Hooks in React.

Don’t call Hooks inside loops, conditions, nested functions, or `try`/`catch`/`finally` blocks. Instead, always use Hooks at the top level of your React function, before any early returns. You can only call Hooks while React is rendering a function component:

- ✅ Call them at the top level in the body of a function component.
- ✅ Call them at the top level in the body of a custom Hook.

```jsx
function Counter() {
  // ✅ Good: top-level in a function component
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Good: top-level in a custom Hook
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

It’s not supported to call Hooks (functions starting with `use`) in any other cases, for example:

- 🔴 Do not call Hooks inside conditions or loops.
- 🔴 Do not call Hooks after a conditional return statement.
- 🔴 Do not call Hooks in event handlers.
- 🔴 Do not call Hooks in class components.
- 🔴 Do not call Hooks inside functions passed to `useMemo`, `useReducer`, or `useEffect`.
- 🔴 Do not call Hooks inside `try`/`catch`/`finally` blocks.

If you break these rules, you might see a Rules of Hooks error.

```jsx
function Bad({ cond }) {
  if (cond) {
    // 🔴 Bad: inside a condition (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Bad: inside a loop (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Bad: after a conditional return (to fix, move it before the return!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Bad: inside an event handler (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Bad: inside useMemo (to fix, move it outside!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Bad: inside a class component (to fix, write a function component instead of a class!)
    useEffect(() => {});
    // ...
  }
}

function Bad() {
  try {
    // 🔴 Bad: inside try/catch/finally block (to fix, move it outside!)
    const [x, setX] = useState(0);
  } catch {
    const [x, setX] = useState(1);
  }
}
```

You can use the `eslint-plugin-react-hooks` plugin to catch these mistakes.

> **Note:** Custom Hooks may call other Hooks (that’s their whole purpose). This works because custom Hooks are also supposed to only be called while a function component is rendering.

### 4.2 Only call Hooks from React functions

Don’t call Hooks from regular JavaScript functions. Instead, you can:

- ✅ Call Hooks from React function components.
- ✅ Call Hooks from custom Hooks.

By following this rule, you ensure that all stateful logic in a component is clearly visible from its source code.

```jsx
function FriendList() {
  const [onlineStatus, setOnlineStatus] = useOnlineStatus(); // ✅
}

function setOnlineStatus() {
  // ❌ Not a component or custom Hook!
  const [onlineStatus, setOnlineStatus] = useOnlineStatus();
}
```

---

## 5. Strict Mode

`<StrictMode>` lets you find common bugs in your components early during development.

```jsx
<StrictMode>
  <App />
</StrictMode>
```

### 5.1 Reference

Use `StrictMode` to enable additional development behaviors and warnings for the component tree inside:

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Strict Mode enables the following development-only behaviors:

- Your components will **re-render an extra time** to find bugs caused by impure rendering.
- Your components will **re-run Effects an extra time** to find bugs caused by missing Effect cleanup.
- Your components will **re-run ref callbacks an extra time** to find bugs caused by missing ref cleanup.
- Your components will be checked for usage of **deprecated APIs**.

#### Props

`StrictMode` accepts no props.

#### Caveats

There is no way to opt out of Strict Mode inside a tree wrapped in `<StrictMode>`. This gives you confidence that all components inside `<StrictMode>` are checked. If two teams working on a product disagree whether they find the checks valuable, they need to either reach consensus or move `<StrictMode>` down in the tree.

### 5.2 Enabling Strict Mode for entire app

Strict Mode enables extra development-only checks for the entire component tree inside the `<StrictMode>` component. These checks help you find common bugs in your components early in the development process.

To enable Strict Mode for your entire app, wrap your root component with `<StrictMode>` when you render it (as shown above).

We recommend wrapping your entire app in Strict Mode, especially for newly created apps. If you use a framework that calls `createRoot` for you, check its documentation for how to enable Strict Mode.

Although the Strict Mode checks only run in development, they help you find bugs that already exist in your code but can be tricky to reliably reproduce in production. Strict Mode lets you fix bugs before your users report them.

> **Note:** All of these checks are development-only and do not impact the production build.

**This project already enables Strict Mode** in `src/index.jsx`:

```jsx
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### 5.3 Enabling Strict Mode for a part of the app

You can also enable Strict Mode for any part of your application:

```jsx
import { StrictMode } from 'react';

function App() {
  return (
    <>
      <Header />
      <StrictMode>
        <main>
          <Sidebar />
          <Content />
        </main>
      </StrictMode>
      <Footer />
    </>
  );
}
```

In this example, Strict Mode checks will not run against the `Header` and `Footer` components. However, they will run on `Sidebar` and `Content`, as well as all of the components inside them, no matter how deep.

> **Note:** When `StrictMode` is enabled for a part of the app, React will only enable behaviors that are possible in production. For example, if `<StrictMode>` is not enabled at the root of the app, it will not re-run Effects an extra time on initial mount, since this would cause child effects to double fire without the parent effects, which cannot happen in production.

### 5.4 Fixing bugs found by double rendering in development

React assumes that every component you write is a pure function. This means that React components you write must always return the same JSX given the same inputs (props, state, and context).

Components breaking this rule behave unpredictably and cause bugs. To help you find accidentally impure code, Strict Mode calls some of your functions (only the ones that should be pure) twice in development. This includes:

- Your component function body (only top-level logic, so this doesn’t include code inside event handlers)
- Functions that you pass to `useState`, set functions, `useMemo`, or `useReducer`
- Some class component methods like `constructor`, `render`, `shouldComponentUpdate`

If a function is pure, running it twice does not change its behavior because a pure function produces the same result every time. However, if a function is impure (for example, it mutates the data it receives), running it twice tends to be noticeable (that’s what makes it impure!) This helps you spot and fix the bug early.

#### Bad example — mutating props array during render

This `StoryTray` component takes an array of stories and adds one last “Create Story” item at the end:

```jsx
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' }); // 🔴 mutates props
  return (
    <ul>
      {items.map((story) => (
        <li key={story.id}>{story.label}</li>
      ))}
    </ul>
  );
}
```

There is a mistake in the code above. However, it is easy to miss because the initial output appears correct.

This mistake will become more noticeable if the `StoryTray` component re-renders multiple times. For example, with hover state:

```jsx
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff',
      }}
    >
      {items.map((story) => (
        <li key={story.id}>{story.label}</li>
      ))}
    </ul>
  );
}
```

Notice how every time you hover over the `StoryTray` component, “Create Story” gets added to the list again. The intention of the code was to add it once at the end. But `StoryTray` directly modifies the `stories` array from the props. Every time `StoryTray` renders, it adds “Create Story” again at the end of the same array. In other words, `StoryTray` is not a pure function — running it multiple times produces different results.

#### Fix — clone before mutating locally

```jsx
export default function StoryTray({ stories }) {
  const items = stories.slice(); // Clone the array
  // ✅ Good: Pushing into a new array
  items.push({ id: 'create', label: 'Create Story' });
  // ...
}
```

This would make the `StoryTray` function pure. Each time it is called, it would only modify a new copy of the array, and would not affect any external objects or variables.

With Strict Mode, React always calls your rendering function twice, so you can see the mistake right away (“Create Story” appears twice / duplicate keys). This lets you notice such mistakes early. When you fix your component to render in Strict Mode, you also fix many possible future production bugs.

> **Note:** If you have React DevTools installed, any `console.log` calls during the second render call will appear slightly dimmed. React DevTools also offers a setting (off by default) to suppress them completely.

### 5.5 Fixing bugs found by re-running Effects in development

Strict Mode can also help find bugs in Effects.

Every Effect has some setup code and may have some cleanup code. Normally, React calls setup when the component mounts (is added to the screen) and calls cleanup when the component unmounts (is removed from the screen). React then calls cleanup and setup again if its dependencies changed since the last render.

When Strict Mode is on, React will also run one extra setup+cleanup cycle in development for every Effect. This may feel surprising, but it helps reveal subtle bugs that are hard to catch manually.

#### Missing cleanup (connection leak)

```jsx
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  // 🔴 Missing cleanup — connections keep growing
}, [roomId]);
```

**Fix:**

```jsx
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => connection.disconnect(); // ✅ cleanup
}, [roomId]);
```

With Strict Mode, you immediately see that there is a problem (e.g. active connections jump to 2 on mount). Strict Mode runs an extra setup+cleanup cycle for every Effect. This Effect has no cleanup logic, so it creates an extra connection but doesn’t destroy it. This is a hint that you’re missing a cleanup function.

Without Strict Mode, it was easy to miss that your Effect needed cleanup. By running setup → cleanup → setup instead of setup for your Effect in development, Strict Mode made the missing cleanup logic more noticeable.

### 5.6 Fixing bugs found by re-running ref callbacks in development

Strict Mode can also help find bugs in callback refs.

Every callback ref has some setup code and may have some cleanup code. Normally, React calls setup when the element is created (is added to the DOM) and calls cleanup when the element is removed (is removed from the DOM).

When Strict Mode is on, React will also run one extra setup+cleanup cycle in development for every callback ref. This may feel surprising, but it helps reveal subtle bugs that are hard to catch manually.

#### Missing ref cleanup (memory leak)

```jsx
<li
  ref={(node) => {
    const list = itemsRef.current;
    const item = { animal, node };
    list.push(item);
    return () => {
      // 🚩 No cleanup, this is a bug!
    };
  }}
/>
```

**Fix:** remove the item in the cleanup function returned from the ref callback so the list never grows unboundedly.

Without Strict Mode, it was easy to miss the bug until you clicked around the app to notice broken features. Strict Mode made the bugs appear right away, before you push them to production.

### 5.7 Fixing deprecation warnings enabled by Strict Mode

React warns if some component anywhere inside a `<StrictMode>` tree uses one of these deprecated APIs:

- `UNSAFE_` class lifecycle methods like `UNSAFE_componentWillMount`. See React docs for alternatives.

These APIs are primarily used in older class components so they rarely appear in modern apps.

---

## 6. Code quality (10 principles)

High-quality code is the backbone of a maintainable and scalable React application. Adhering to best practices ensures that the codebase remains clean, readable, and easy to debug. Below are fundamental principles to maintain high code quality in React projects.

### 6.1 Write readable code

Readable code improves collaboration and long-term maintainability. Follow these principles:

- Keep functions short and focused; each function should do one thing well.
- Use proper indentation and spacing.
- Avoid deeply nested logic; break it into smaller functions when needed.

**Bad code**

```js
function d(a, b) {
  return a + b;
}
const c = d(5, 10);
```

Problems in this code:

- The function name `d` is vague and does not indicate its purpose.
- Variable `c` is not descriptive.
- Lack of spacing / clarity makes the code harder to read.

**Good code**

```js
function addNumbers(num1, num2) {
  return num1 + num2;
}

const sum = addNumbers(5, 10);
```

- Descriptive function and variable names.
- Proper indentation and spacing.
- Readability improved without additional effort.

### 6.2 Write self-documenting code

Code should be clear enough that it “explains itself.”

- Avoid excessive comments. Write them only for complex or non-obvious logic.
- Prefer expressive variable, function, and component names.

### 6.3 Avoid magic numbers and strings

Instead of using hardcoded values, define constants and enums to improve maintainability.

**Good example**

```js
const MAX_RETRIES = 3;
if (retryCount > MAX_RETRIES) {
  throw new Error('Max retries exceeded');
}
```

### 6.4 Keep functions and components small

A function or component should do one thing and do it well. If it starts to get too large, break it into smaller, reusable pieces. Each component should have a single responsibility:

- Break down large components into smaller, reusable ones.
- Keep business logic out of UI components:
  - Use custom hooks for logic.
  - Use utility functions for repeated logic.

### 6.5 Use hooks correctly

Hooks should be used correctly to prevent issues:

- Follow the Rules of Hooks (only call hooks at the top level and inside React functions).
- Avoid unnecessary dependencies in `useEffect`.
- Use `useReducer` for complex state management instead of excessive `useState` calls.

### 6.6 Minimize side effects

- Prefer pure functions that return the same output for the same input.
- Avoid hidden mutations or modifying external variables.
- Keep side effects inside controlled hooks like `useEffect` (or event handlers).

### 6.7 Use TypeScript (or PropTypes)

- Static typing with TypeScript helps catch errors early and improves the development experience.
- If TypeScript isn’t used, apply PropTypes for type validation in components.
- Always type function parameters, props, and return values when the toolchain supports it.

> **This project:** currently uses JavaScript + React. Prefer clear prop shapes, JSDoc where helpful, and keep the door open for PropTypes/TypeScript on complex surfaces.

### 6.8 Handle errors gracefully

Errors are inevitable, but handling them properly improves user experience:

- Wrap critical UI components with an `ErrorBoundary` to prevent crashes.
- Use `try`/`catch` blocks for async operations.

**Example**

```js
try {
  const data = await fetchUser();
  setUser(data);
} catch (error) {
  console.error(error);
  showToast('Failed to load user');
}
```

### 6.9 Write reusable and maintainable code

- Extract common logic into reusable custom hooks and utility functions.
- Follow the DRY (Don’t Repeat Yourself) principle — avoid copy-paste logic.
- Avoid hardcoded values; use constants and environment variables instead.

### 6.10 Enforce standards

- **Linting and Formatting:** Use ESLint rules and Prettier configuration to enforce consistent style automatically.
- **Type Safety:** Using TypeScript or PropTypes for type-checking.
- **Code Reviews:** Conduct reviews not just for correctness, but for readability, maintainability, and adherence to best practices.

---

## 7. One level of abstraction per function

Keeping **one level of abstraction per function** makes React code faster to read, safer to change, and naturally reusable — which leads to smoother, more production-ready apps.

### 7.1 The problem — mixed abstraction levels

Imagine we're working on an app that shows a user profile page. Our job is to fetch the user data, show a loading state while it's being fetched, and display whether the user is currently active. Here’s a common example:

```jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`https://api.example.com/users/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        const isActive =
          data.accountStatus === 'active' &&
          new Date(data.lastLogin) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        setUser({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          isActive,
        });
      });
  }, [userId]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {user.name} is {user.isActive ? 'active' : 'inactive'}
    </div>
  );
}
```

This is a quite common type of code seen across React codebases. Not very complicated, rather simple stuff, with some logic sprinkled here and there. It's not pretty, but it's not particularly bad either. It has one issue though: **mixed abstraction levels**.

### 7.2 Controlling abstraction levels

When we write code, mixing different levels of detail within a single function often leads to confusion and makes it harder to follow. For example, if something shifts to a lower level — like combining the user's first and last names into a single string — it disrupts the higher-level purpose of a function like `UserProfile`, which is meant to represent an entire page in our app.

A cleaner approach is to keep each function at a consistent level of abstraction. In practice, this means that high-level functions should focus on **orchestration**, while details should be abstracted out into smaller functions.

### 7.3 Cleaner approach

```jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then((data) => setUser(normalizeUser(data)));
  }, [userId]);

  if (!user) {
    return <Loader />;
  }

  return <UserStatus user={user} />;
}
```

Notice how much easier to read it is now. Each line flows like a simple sentence in a book, with everything kept at the same level of abstraction. One quick glance at the component, and we immediately understand what it does!

We don't have to worry about the endpoint URL for fetching the user or the data transformation logic in `normalizeUser`. We’re also not concerned with what the `Loader` component displays — we just know it needs to appear while we’re waiting for the data.

The rest of the logic has been broken down into small, focused functions.

#### `fetchUser` — network detail

```js
function fetchUser(id) {
  const url = `https://api.example.com/users/${id}`;
  return fetch(url).then((response) => response.json());
}
```

#### `normalizeUser` — data shaping

```js
function normalizeUser(data) {
  const isActive = isUserActive(data);

  return {
    name: `${data.firstName} ${data.lastName}`,
    email: data.email,
    isActive,
  };
}
```

#### `isUserActive` — domain rule (with named constants, no magic numbers)

```js
function isUserActive(user) {
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
  const wasLoggedInDuringLastThirtyDays =
    new Date(user.lastLogin) >= new Date(Date.now() - thirtyDaysInMs);

  return user.accountStatus === 'active' && wasLoggedInDuringLastThirtyDays;
}
```

Introducing a separate `thirtyDaysInMs` variable adds meaning to otherwise mysterious numbers. Why should another developer have to wonder what these numbers represent when we can make it clear from the start?

### 7.4 Benefits of maintaining a single level of abstraction per function

Apart from the obvious advantage of cleaner, more readable code, there are several other benefits:

- **Isolated changes are easier and safer to make.** When you need to update only the logic for determining if a user is active, you can modify the `isUserActive` utility without touching the `UserProfile` component itself. No risk of accidentally breaking the behavior of the latter.
- **Reusable code out of the box.** By writing modular functions, your code becomes naturally reusable across different parts of the project.
- **Reduced cognitive load.** Developers can focus on one small piece of code at a time, without need to hold a sprawling 200-line component in their head.
- **Separation of concerns detector.** Switching abstraction levels is often a red flag that code is taking on additional responsibilities, signaling when a refactor might be due.

The potential downside is that smaller functions can require more jumping around in the codebase. However, this is a necessary trade-off; keeping one large component out of convenience tends to lead to much bigger issues down the road.

---

## 8. Project checklist (A–Z)

Use this checklist on every PR / feature / page in **baracuda260**:

| Step | Rule | Do this |
|------|------|---------|
| **A** | Pure render | Same props/state/context → same JSX |
| **B** | No render side effects | No fetch, timers, DOM writes, or global mutation in render |
| **C** | Immutable props | Never assign into `props` or nested props objects |
| **D** | Immutable state | Always `setState` / functional updates; never mutate state in place |
| **E** | Immutable Hook args/returns | Copy before change; don’t mutate memoized values |
| **F** | Immutable after JSX | Don’t mutate an object after passing it into JSX |
| **G** | Components via JSX only | Never `Component()` — always `<Component />` |
| **H** | Hooks are not values | Don’t pass Hooks as props or wrap them dynamically |
| **I** | Hooks top-level | No Hooks in loops, conditions, nested fns, try/catch, or after early return |
| **J** | Hooks from React only | Only function components + custom Hooks |
| **K** | Effect cleanup | Every subscribe/timer/connection has a cleanup return |
| **L** | Ref cleanup | Callback refs remove what they add |
| **M** | Readable names | No `d`, `c`, `tmp` for domain logic |
| **N** | Self-documenting | Comments only for non-obvious why |
| **O** | No magic values | Named constants for retries, timeouts, limits, routes |
| **P** | Small units | One responsibility per component/function |
| **Q** | Custom hooks for logic | UI components orchestrate; hooks/utils implement |
| **R** | Minimal effects | Prefer event handlers; Effects only for sync with external systems |
| **S** | Errors handled | ErrorBoundary + try/catch + user-facing feedback |
| **T** | DRY | Shared chrome/data in hooks, utils, shared components |
| **U** | Env & config | Use `process.env` / `src/config` — no hardcoded API secrets |
| **V** | Lint & format | ESLint + Prettier before merge |
| **W** | Strict Mode | Keep root `<StrictMode>` (already in `src/index.jsx`) |
| **X** | One abstraction level | Page orchestrates; fetch/normalize/ui details extracted |
| **Y** | Perf-friendly structure | SplitChunks already configured; avoid impure render that forces extra work |
| **Z** | Review against this doc | Before ship, skim sections 2–7 for the surfaces you touched |

---

## References

- [Rules of React](https://react.dev/reference/rules)
- [Keeping Components Pure](https://react.dev/learn/keeping-components-pure)
- [Strict Mode](https://react.dev/reference/react/StrictMode)
- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)

---

*Last updated for baracuda260 — follow this document for all new and changed React code.*
