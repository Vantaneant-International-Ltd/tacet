The standard Tacet button — primary for the single main action, secondary for everything else, soft for accent-tinted secondary actions, ghost for toolbars, destructive for irreversible acts.

```jsx
<Button>Follow</Button>
<Button variant="secondary">Message</Button>
<Button variant="soft" iconLeft={<Icon name="square-pen" size={18}/>}>Compose</Button>
```

One primary button per view. Sizes sm/md/lg; `disabled` dims to 45% opacity.
