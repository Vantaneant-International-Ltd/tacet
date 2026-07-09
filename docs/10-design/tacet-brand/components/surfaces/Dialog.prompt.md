Centered modal over a blurred scrim; enters with a gentle rise.

```jsx
<Dialog
  open={open}
  onClose={close}
  title="Move home?"
  description="Your people and posts come with you."
  actions={<><Button variant="ghost" onClick={close}>Not now</Button><Button>Move</Button></>}
/>
```
