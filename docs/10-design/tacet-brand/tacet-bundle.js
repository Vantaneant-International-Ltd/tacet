/* tacet-bundle.js — fallback component bundle (auto-generated from components/**.jsx; the platform's _ds_bundle.js takes precedence when present). Requires window.React. */
(function(){
window.TacetDS = window.TacetDS || {};

/* == components/core/Icon.jsx == */
(function(){
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Tacet product icon set — Lucide (ISC), outline / rounded / 2px stroke. */
const ICON_NAMES = ["house", "sun", "users", "users-round", "compass", "message-circle", "search", "settings", "square-pen", "bell", "circle-user", "bookmark", "image", "video", "file-text", "link", "map-pin", "calendar", "globe", "lock", "network", "server", "download", "upload", "heart", "repeat-2", "share", "ellipsis", "plus", "x", "chevron-down", "chevron-right", "arrow-left", "moon", "check", "sparkles"];
const PATHS = {
  'house': "<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\" /><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" />",
  'sun': "<circle cx=\"12\" cy=\"12\" r=\"4\" /><path d=\"M12 2v2\" /><path d=\"M12 20v2\" /><path d=\"m4.93 4.93 1.41 1.41\" /><path d=\"m17.66 17.66 1.41 1.41\" /><path d=\"M2 12h2\" /><path d=\"M20 12h2\" /><path d=\"m6.34 17.66-1.41 1.41\" /><path d=\"m19.07 4.93-1.41 1.41\" />",
  'users': "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\" /><circle cx=\"9\" cy=\"7\" r=\"4\" /><path d=\"M22 21v-2a4 4 0 0 0-3-3.87\" /><path d=\"M16 3.13a4 4 0 0 1 0 7.75\" />",
  'users-round': "<path d=\"M18 21a8 8 0 0 0-16 0\" /><circle cx=\"10\" cy=\"8\" r=\"5\" /><path d=\"M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3\" />",
  'compass': "<path d=\"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z\" /><circle cx=\"12\" cy=\"12\" r=\"10\" />",
  'message-circle': "<path d=\"M7.9 20A9 9 0 1 0 4 16.1L2 22Z\" />",
  'search': "<circle cx=\"11\" cy=\"11\" r=\"8\" /><path d=\"m21 21-4.3-4.3\" />",
  'settings': "<path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\" /><circle cx=\"12\" cy=\"12\" r=\"3\" />",
  'square-pen': "<path d=\"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\" /><path d=\"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z\" />",
  'bell': "<path d=\"M10.268 21a2 2 0 0 0 3.464 0\" /><path d=\"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326\" />",
  'circle-user': "<circle cx=\"12\" cy=\"12\" r=\"10\" /><circle cx=\"12\" cy=\"10\" r=\"3\" /><path d=\"M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662\" />",
  'bookmark': "<path d=\"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z\" />",
  'image': "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\" /><circle cx=\"9\" cy=\"9\" r=\"2\" /><path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\" />",
  'video': "<path d=\"m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5\" /><rect x=\"2\" y=\"6\" width=\"14\" height=\"12\" rx=\"2\" />",
  'file-text': "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\" /><path d=\"M14 2v4a2 2 0 0 0 2 2h4\" /><path d=\"M10 9H8\" /><path d=\"M16 13H8\" /><path d=\"M16 17H8\" />",
  'link': "<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\" /><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\" />",
  'map-pin': "<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\" /><circle cx=\"12\" cy=\"10\" r=\"3\" />",
  'calendar': "<path d=\"M8 2v4\" /><path d=\"M16 2v4\" /><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" /><path d=\"M3 10h18\" />",
  'globe': "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\" /><path d=\"M2 12h20\" />",
  'lock': "<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\" /><path d=\"M7 11V7a5 5 0 0 1 10 0v4\" />",
  'network': "<rect x=\"16\" y=\"16\" width=\"6\" height=\"6\" rx=\"1\" /><rect x=\"2\" y=\"16\" width=\"6\" height=\"6\" rx=\"1\" /><rect x=\"9\" y=\"2\" width=\"6\" height=\"6\" rx=\"1\" /><path d=\"M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3\" /><path d=\"M12 12V8\" />",
  'server': "<rect width=\"20\" height=\"8\" x=\"2\" y=\"2\" rx=\"2\" ry=\"2\" /><rect width=\"20\" height=\"8\" x=\"2\" y=\"14\" rx=\"2\" ry=\"2\" /><line x1=\"6\" x2=\"6.01\" y1=\"6\" y2=\"6\" /><line x1=\"6\" x2=\"6.01\" y1=\"18\" y2=\"18\" />",
  'download': "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" /><polyline points=\"7 10 12 15 17 10\" /><line x1=\"12\" x2=\"12\" y1=\"15\" y2=\"3\" />",
  'upload': "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" /><polyline points=\"17 8 12 3 7 8\" /><line x1=\"12\" x2=\"12\" y1=\"3\" y2=\"15\" />",
  'heart': "<path d=\"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z\" />",
  'repeat-2': "<path d=\"m2 9 3-3 3 3\" /><path d=\"M13 18H7a2 2 0 0 1-2-2V6\" /><path d=\"m22 15-3 3-3-3\" /><path d=\"M11 6h6a2 2 0 0 1 2 2v10\" />",
  'share': "<path d=\"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8\" /><polyline points=\"16 6 12 2 8 6\" /><line x1=\"12\" x2=\"12\" y1=\"2\" y2=\"15\" />",
  'ellipsis': "<circle cx=\"12\" cy=\"12\" r=\"1\" /><circle cx=\"19\" cy=\"12\" r=\"1\" /><circle cx=\"5\" cy=\"12\" r=\"1\" />",
  'plus': "<path d=\"M5 12h14\" /><path d=\"M12 5v14\" />",
  'x': "<path d=\"M18 6 6 18\" /><path d=\"m6 6 12 12\" />",
  'chevron-down': "<path d=\"m6 9 6 6 6-6\" />",
  'chevron-right': "<path d=\"m9 18 6-6-6-6\" />",
  'arrow-left': "<path d=\"m12 19-7-7 7-7\" /><path d=\"M19 12H5\" />",
  'moon': "<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\" />",
  'check': "<path d=\"M20 6 9 17l-5-5\" />",
  'sparkles': "<path d=\"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z\" /><path d=\"M20 3v4\" /><path d=\"M22 5h-4\" /><path d=\"M4 17v2\" /><path d=\"M5 18H3\" />"
};
function Icon({
  name,
  size = 24,
  strokeWidth = 2,
  style,
  ...rest
}) {
  const inner = PATHS[name];
  if (!inner) return null;
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    style: {
      display: 'block',
      flexShrink: 0,
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: inner
    }
  }, rest));
}
Object.assign(window.TacetDS, { ICON_NAMES, Icon });
})();

/* == components/core/Avatar.jsx == */
(function(){
const PALETTE = ['#7B61FF', '#B19CFF', '#CC5F76', '#3E9E77', '#C98F35', '#5740BF'];
function Avatar({
  name = '',
  src,
  size = 40,
  status,
  style
}) {
  const initials = name.split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  const hue = PALETTE[(name.charCodeAt(0) || 0) % PALETTE.length];
  const dotSize = Math.max(8, Math.round(size * 0.26));
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-block',
      width: size,
      height: size,
      flexShrink: 0,
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      objectFit: 'cover',
      display: 'block'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: hue + '22',
      color: hue,
      fontFamily: 'var(--font-sans)',
      fontWeight: 650,
      fontSize: Math.round(size * 0.38),
      letterSpacing: '0.01em'
    }
  }, initials || '·'), status && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: dotSize,
      height: dotSize,
      borderRadius: '50%',
      background: status === 'away' ? 'var(--status-away)' : 'var(--status-online)',
      border: '2px solid var(--surface-1)',
      boxSizing: 'border-box'
    }
  }));
}
Object.assign(window.TacetDS, { Avatar });
})();

/* == components/core/Button.jsx == */
(function(){
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const SIZES = {
  sm: {
    height: 32,
    padding: '0 12px',
    font: 13
  },
  md: {
    height: 40,
    padding: '0 16px',
    font: 15
  },
  lg: {
    height: 48,
    padding: '0 22px',
    font: 16
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  iconLeft = null,
  style,
  children,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const s = SIZES[size] || SIZES.md;
  const variants = {
    primary: {
      background: press ? 'var(--accent-press)' : hover ? 'var(--accent-hover)' : 'var(--accent)',
      color: 'var(--text-on-accent)',
      border: '1px solid transparent'
    },
    secondary: {
      background: press ? 'var(--press-veil)' : hover ? 'var(--hover-veil)' : 'var(--surface-1)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-1)'
    },
    soft: {
      background: press || hover ? 'var(--accent-soft-hover)' : 'var(--accent-soft)',
      color: 'var(--accent-text)',
      border: '1px solid transparent'
    },
    ghost: {
      background: press ? 'var(--press-veil)' : hover ? 'var(--hover-veil)' : 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent'
    },
    destructive: {
      background: press || hover ? 'var(--error-soft)' : 'transparent',
      color: 'var(--error)',
      border: '1px solid var(--border-default)'
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: s.height,
      padding: s.padding,
      fontFamily: 'var(--font-sans)',
      fontSize: s.font,
      fontWeight: 600,
      letterSpacing: 'var(--type-button-track)',
      borderRadius: 'var(--radius-sm)',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 'var(--opacity-disabled)' : 1,
      transform: press && !disabled ? 'scale(0.98)' : 'none',
      transition: 'background var(--duration-instant) var(--ease-glide), transform var(--duration-instant) var(--ease-glide)',
      ...variants[variant],
      ...style
    }
  }, rest), iconLeft, children);
}
Object.assign(window.TacetDS, { Button });
})();

/* == components/core/IconButton.jsx == */
(function(){
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const {
  Icon
} = window.TacetDS;
function IconButton({
  name,
  size = 'md',
  active = false,
  label,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const dim = size === 'sm' ? 32 : size === 'lg' ? 48 : 40;
  const iconSize = size === 'sm' ? 18 : 20;
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": label || name,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: dim,
      height: dim,
      padding: 0,
      background: press ? 'var(--press-veil)' : hover ? 'var(--hover-veil)' : 'transparent',
      color: active ? 'var(--accent-text)' : 'var(--text-secondary)',
      border: 'none',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
      transform: press ? 'scale(0.96)' : 'none',
      transition: 'background var(--duration-instant) var(--ease-glide), color var(--duration-instant) var(--ease-glide), transform var(--duration-instant) var(--ease-glide)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(Icon, {
    name: name,
    size: iconSize
  }));
}
Object.assign(window.TacetDS, { IconButton });
})();

/* == components/core/Input.jsx == */
(function(){
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function Input({
  label,
  hint,
  error,
  style,
  inputStyle,
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      lineHeight: '18px',
      fontWeight: 500,
      color: 'var(--text-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      height: 40,
      padding: '0 14px',
      boxSizing: 'border-box',
      width: '100%',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      color: 'var(--text-primary)',
      background: 'var(--surface-1)',
      border: `1px solid ${error ? 'var(--error)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-sm)',
      outline: 'none',
      boxShadow: focus ? 'var(--focus-ring)' : 'none',
      transition: 'box-shadow var(--duration-instant) var(--ease-glide), border-color var(--duration-instant) var(--ease-glide)',
      ...inputStyle
    }
  }, rest)), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      lineHeight: '18px',
      color: error ? 'var(--error)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(window.TacetDS, { Input });
})();

/* == components/core/SearchField.jsx == */
(function(){
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const {
  Icon
} = window.TacetDS;
function SearchField({
  placeholder = 'Search people, posts, communities…',
  style,
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      height: 40,
      padding: '0 14px',
      boxSizing: 'border-box',
      background: 'var(--surface-2)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-full)',
      boxShadow: focus ? 'var(--focus-ring)' : 'none',
      transition: 'box-shadow var(--duration-instant) var(--ease-glide)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 18,
    style: {
      color: 'var(--text-muted)'
    }
  }), /*#__PURE__*/React.createElement("input", _extends({
    placeholder: placeholder,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      color: 'var(--text-primary)'
    }
  }, rest)));
}
Object.assign(window.TacetDS, { SearchField });
})();

/* == components/core/Switch.jsx == */
(function(){
function Switch({
  checked = false,
  onChange,
  disabled = false,
  style
}) {
  return /*#__PURE__*/React.createElement("button", {
    role: "switch",
    "aria-checked": checked,
    disabled: disabled,
    onClick: () => onChange && onChange(!checked),
    style: {
      width: 44,
      height: 26,
      padding: 2,
      boxSizing: 'border-box',
      background: checked ? 'var(--accent)' : 'var(--border-strong)',
      border: 'none',
      borderRadius: 'var(--radius-full)',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 'var(--opacity-disabled)' : 1,
      transition: 'background var(--duration-quick) var(--ease-glide)',
      display: 'inline-flex',
      alignItems: 'center',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      borderRadius: '50%',
      background: '#FFFFFF',
      boxShadow: '0 1px 3px rgba(20,12,40,0.25)',
      transform: checked ? 'translateX(18px)' : 'translateX(0)',
      transition: 'transform var(--duration-quick) var(--ease-glide)'
    }
  }));
}
Object.assign(window.TacetDS, { Switch });
})();

/* == components/core/Tabs.jsx == */
(function(){
const {
  useState
} = React;
function Tabs({
  tabs = [],
  value,
  onChange,
  style
}) {
  const [hovered, setHovered] = useState(null);
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 4,
      borderBottom: '1px solid var(--border-subtle)',
      ...style
    }
  }, tabs.map(t => {
    const key = typeof t === 'string' ? t : t.value;
    const label = typeof t === 'string' ? t : t.label;
    const active = key === value;
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      role: "tab",
      "aria-selected": active,
      onClick: () => onChange && onChange(key),
      onMouseEnter: () => setHovered(key),
      onMouseLeave: () => setHovered(null),
      style: {
        position: 'relative',
        padding: '10px 14px 12px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 15,
        lineHeight: '20px',
        fontWeight: active ? 600 : 500,
        color: active ? 'var(--text-primary)' : hovered === key ? 'var(--text-primary)' : 'var(--text-secondary)',
        transition: 'color var(--duration-instant) var(--ease-glide)'
      }
    }, label, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 10,
        right: 10,
        bottom: -1,
        height: 2,
        borderRadius: 1,
        background: active ? 'var(--accent)' : 'transparent',
        transition: 'background var(--duration-quick) var(--ease-glide)'
      }
    }));
  }));
}
Object.assign(window.TacetDS, { Tabs });
})();

/* == components/core/Chip.jsx == */
(function(){
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function Chip({
  active = false,
  onClick,
  style,
  children,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 32,
      padding: '0 14px',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 500,
      color: active ? 'var(--text-on-accent)' : 'var(--text-secondary)',
      background: active ? 'var(--accent)' : hover ? 'var(--hover-veil)' : 'var(--surface-1)',
      border: `1px solid ${active ? 'transparent' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-full)',
      cursor: 'pointer',
      transition: 'background var(--duration-instant) var(--ease-glide), color var(--duration-instant) var(--ease-glide)',
      ...style
    }
  }, rest), children);
}
Object.assign(window.TacetDS, { Chip });
})();

/* == components/core/Badge.jsx == */
(function(){
const TONES = {
  neutral: {
    background: 'var(--surface-3)',
    color: 'var(--text-secondary)'
  },
  accent: {
    background: 'var(--accent-soft)',
    color: 'var(--accent-text)'
  },
  success: {
    background: 'var(--success-soft)',
    color: 'var(--success)'
  },
  warning: {
    background: 'var(--warning-soft)',
    color: 'var(--warning)'
  },
  error: {
    background: 'var(--error-soft)',
    color: 'var(--error)'
  }
};
function Badge({
  tone = 'neutral',
  dot = false,
  style,
  children
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 22,
      padding: '0 8px',
      fontFamily: 'var(--font-sans)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.02em',
      borderRadius: 'var(--radius-xs)',
      ...t,
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'currentColor'
    }
  }), children);
}
Object.assign(window.TacetDS, { Badge });
})();

/* == components/surfaces/Card.jsx == */
(function(){
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function Card({
  interactive = false,
  padding = 20,
  style,
  children,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      boxShadow: interactive && hover ? 'var(--shadow-2)' : 'var(--shadow-1)',
      padding,
      cursor: interactive ? 'pointer' : 'default',
      transition: 'box-shadow var(--duration-quick) var(--ease-glide)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, rest), children);
}
Object.assign(window.TacetDS, { Card });
})();

/* == components/surfaces/Dialog.jsx == */
(function(){
function Dialog({
  open = false,
  title,
  description,
  actions,
  onClose,
  width = 420,
  children
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(10, 6, 19, 0.45)',
      backdropFilter: 'blur(var(--blur-veil))',
      WebkitBackdropFilter: 'blur(var(--blur-veil))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation(),
    style: {
      width,
      maxWidth: '100%',
      boxSizing: 'border-box',
      background: 'var(--surface-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-4)',
      padding: 28,
      fontFamily: 'var(--font-sans)',
      animation: 'tacet-dialog-in var(--duration-gentle) var(--ease-enter)'
    }
  }, /*#__PURE__*/React.createElement("style", null, '@keyframes tacet-dialog-in { from { opacity: 0; transform: translateY(10px) scale(0.99); } to { opacity: 1; transform: none; } }'), title && /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 21,
      lineHeight: '28px',
      fontWeight: 600,
      letterSpacing: '-0.008em',
      color: 'var(--text-primary)'
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '10px 0 0',
      fontSize: 15,
      lineHeight: '23px',
      color: 'var(--text-secondary)'
    }
  }, description), children, actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 24
    }
  }, actions)));
}
Object.assign(window.TacetDS, { Dialog });
})();

/* == components/surfaces/Toast.jsx == */
(function(){
const {
  Icon
} = window.TacetDS;
const TONES = {
  neutral: {
    icon: 'check',
    color: 'var(--text-primary)'
  },
  success: {
    icon: 'check',
    color: 'var(--success)'
  },
  error: {
    icon: 'x',
    color: 'var(--error)'
  }
};
function Toast({
  tone = 'neutral',
  action,
  onAction,
  style,
  children
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 16px',
      background: 'var(--surface-overlay)',
      backdropFilter: 'blur(var(--blur-veil))',
      WebkitBackdropFilter: 'blur(var(--blur-veil))',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-3)',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--text-primary)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: t.icon,
    size: 16,
    style: {
      color: t.color
    }
  }), /*#__PURE__*/React.createElement("span", null, children), action && /*#__PURE__*/React.createElement("button", {
    onClick: onAction,
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--accent-text)',
      padding: '0 2px'
    }
  }, action));
}
Object.assign(window.TacetDS, { Toast });
})();

/* == components/surfaces/Skeleton.jsx == */
(function(){
function Skeleton({
  width = '100%',
  height = 16,
  circle = false,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'block',
      width: circle ? height : width,
      height,
      borderRadius: circle ? '50%' : 'var(--radius-xs)',
      background: 'linear-gradient(100deg, var(--skeleton-base) 40%, var(--skeleton-sheen) 50%, var(--skeleton-base) 60%)',
      backgroundSize: '200% 100%',
      animation: 'tacet-skeleton 1.6s var(--ease-breathe) infinite',
      ...style
    }
  }, /*#__PURE__*/React.createElement("style", null, '@keyframes tacet-skeleton { from { background-position: 120% 0; } to { background-position: -80% 0; } }'));
}
Object.assign(window.TacetDS, { Skeleton });
})();

/* == components/social/PostCard.jsx == */
(function(){
const {
  useState
} = React;
const {
  Avatar
} = window.TacetDS;
const {
  Icon
} = window.TacetDS;
const {
  IconButton
} = window.TacetDS;
const {
  Card
} = window.TacetDS;
function ActionButton({
  name,
  count,
  active,
  activeColor,
  onClick
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 32,
      padding: '0 10px',
      marginLeft: -10,
      background: hover ? 'var(--hover-veil)' : 'transparent',
      border: 'none',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 500,
      color: active ? activeColor || 'var(--accent-text)' : 'var(--text-muted)',
      transition: 'background var(--duration-instant) var(--ease-glide), color var(--duration-instant) var(--ease-glide)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: name,
    size: 17,
    style: active && name === 'heart' ? {
      fill: 'currentColor'
    } : undefined
  }), count != null && /*#__PURE__*/React.createElement("span", null, count));
}
function PostCard({
  author = 'Maya Chen',
  handle = '@maya@tacet.home',
  time = '2h',
  avatarSrc,
  media = null,
  likes,
  replies,
  shares,
  liked = false,
  bookmarked = false,
  onLike,
  onReply,
  onShare,
  onBookmark,
  style,
  children
}) {
  return /*#__PURE__*/React.createElement(Card, {
    padding: 0,
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      padding: '16px 20px 0'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: author,
    src: avatarSrc,
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, author), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, handle), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, "\xB7 ", time)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 15,
      lineHeight: '23px',
      color: 'var(--text-primary)',
      overflowWrap: 'break-word'
    }
  }, children)), /*#__PURE__*/React.createElement(IconButton, {
    name: "ellipsis",
    size: "sm",
    label: "More"
  })), media && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '12px 20px 0',
      borderRadius: 10,
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)'
    }
  }, media), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      padding: '8px 20px 10px',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(ActionButton, {
    name: "heart",
    count: likes,
    active: liked,
    activeColor: "var(--error)",
    onClick: onLike
  }), /*#__PURE__*/React.createElement(ActionButton, {
    name: "message-circle",
    count: replies,
    onClick: onReply
  }), /*#__PURE__*/React.createElement(ActionButton, {
    name: "repeat-2",
    count: shares,
    onClick: onShare
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(ActionButton, {
    name: "bookmark",
    active: bookmarked,
    onClick: onBookmark
  })));
}
Object.assign(window.TacetDS, { PostCard });
})();

/* == components/social/PersonCard.jsx == */
(function(){
const {
  Avatar
} = window.TacetDS;
const {
  Button
} = window.TacetDS;
const {
  Card
} = window.TacetDS;
function PersonCard({
  name = 'Maya Chen',
  handle = '@maya@tacet.home',
  bio,
  avatarSrc,
  status,
  following = false,
  onFollow,
  style
}) {
  return /*#__PURE__*/React.createElement(Card, {
    padding: 16,
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: name,
    src: avatarSrc,
    size: 48,
    status: status
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, handle)), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: following ? 'secondary' : 'primary',
    onClick: onFollow
  }, following ? 'Following' : 'Follow')), bio && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '10px 0 0',
      fontSize: 14,
      lineHeight: '21px',
      color: 'var(--text-secondary)'
    }
  }, bio));
}
Object.assign(window.TacetDS, { PersonCard });
})();

/* == components/social/CommunityCard.jsx == */
(function(){
const {
  Button
} = window.TacetDS;
const {
  Icon
} = window.TacetDS;
const {
  Card
} = window.TacetDS;
function CommunityCard({
  name = 'Slow Photography',
  server = 'tacet.home',
  members = '128 people',
  description,
  joined = false,
  onJoin,
  icon = 'users-round',
  style
}) {
  return /*#__PURE__*/React.createElement(Card, {
    padding: 16,
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 'var(--radius-md)',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--accent-soft)',
      color: 'var(--accent-text)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 2,
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12
    }
  }, server), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, members))), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: joined ? 'secondary' : 'soft',
    onClick: onJoin
  }, joined ? 'Joined' : 'Join')), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '10px 0 0',
      fontSize: 14,
      lineHeight: '21px',
      color: 'var(--text-secondary)'
    }
  }, description));
}
Object.assign(window.TacetDS, { CommunityCard });
})();

/* == components/social/NotificationItem.jsx == */
(function(){
const {
  useState
} = React;
const {
  Avatar
} = window.TacetDS;
const {
  Icon
} = window.TacetDS;
const KIND_META = {
  like: {
    icon: 'heart',
    color: 'var(--error)'
  },
  reply: {
    icon: 'message-circle',
    color: 'var(--accent-text)'
  },
  follow: {
    icon: 'users',
    color: 'var(--accent-text)'
  },
  share: {
    icon: 'repeat-2',
    color: 'var(--success)'
  }
};
function NotificationItem({
  kind = 'like',
  name = 'Maya Chen',
  avatarSrc,
  time = '2h',
  unread = false,
  style,
  children
}) {
  const [hover, setHover] = useState(false);
  const meta = KIND_META[kind] || KIND_META.like;
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '12px 16px',
      background: hover ? 'var(--hover-veil)' : 'transparent',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      transition: 'background var(--duration-instant) var(--ease-glide)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: name,
    src: avatarSrc,
    size: 40
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: -4,
      bottom: -4,
      width: 20,
      height: 20,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--surface-1)',
      color: meta.color,
      boxShadow: 'var(--shadow-1)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: meta.icon,
    size: 11,
    strokeWidth: 2.5
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      lineHeight: '21px',
      color: 'var(--text-primary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, name), " ", children), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, time)), unread && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--accent)',
      marginTop: 6,
      flexShrink: 0
    }
  }));
}
Object.assign(window.TacetDS, { NotificationItem });
})();

/* == components/navigation/SideNav.jsx == */
(function(){
const {
  useState
} = React;
const {
  Icon
} = window.TacetDS;
const NAV_ITEMS = [{
  key: 'today',
  label: 'Today',
  icon: 'sun'
}, {
  key: 'people',
  label: 'People',
  icon: 'users'
}, {
  key: 'discover',
  label: 'Discover',
  icon: 'compass'
}, {
  key: 'communities',
  label: 'Communities',
  icon: 'users-round'
}, {
  key: 'conversations',
  label: 'Conversations',
  icon: 'message-circle'
}, {
  key: 'bookmarks',
  label: 'Bookmarks',
  icon: 'bookmark'
}];
function SideNav({
  items = NAV_ITEMS,
  value = 'today',
  onChange,
  footer,
  style
}) {
  const [hovered, setHovered] = useState(null);
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      width: 220,
      padding: 12,
      boxSizing: 'border-box',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, items.map(it => {
    const active = it.key === value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.key,
      onClick: () => onChange && onChange(it.key),
      onMouseEnter: () => setHovered(it.key),
      onMouseLeave: () => setHovered(null),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        height: 40,
        padding: '0 12px',
        background: active ? 'var(--accent-soft)' : hovered === it.key ? 'var(--hover-veil)' : 'transparent',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 15,
        textAlign: 'left',
        fontWeight: active ? 600 : 500,
        color: active ? 'var(--accent-text)' : 'var(--text-secondary)',
        transition: 'background var(--duration-instant) var(--ease-glide), color var(--duration-instant) var(--ease-glide)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: it.icon,
      size: 20
    }), it.label);
  }), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto'
    }
  }, footer));
}
Object.assign(window.TacetDS, { NAV_ITEMS, SideNav });
})();

/* == components/navigation/BottomNav.jsx == */
(function(){
const {
  Icon
} = window.TacetDS;
const DEFAULT_ITEMS = [{
  key: 'today',
  label: 'Today',
  icon: 'sun'
}, {
  key: 'people',
  label: 'People',
  icon: 'users'
}, {
  key: 'compose',
  label: 'Compose',
  icon: 'square-pen',
  primary: true
}, {
  key: 'discover',
  label: 'Discover',
  icon: 'compass'
}, {
  key: 'profile',
  label: 'Profile',
  icon: 'circle-user'
}];
function BottomNav({
  items = DEFAULT_ITEMS,
  value = 'today',
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      height: 64,
      padding: '0 8px',
      boxSizing: 'border-box',
      background: 'var(--surface-overlay)',
      backdropFilter: 'blur(var(--blur-glass))',
      WebkitBackdropFilter: 'blur(var(--blur-glass))',
      borderTop: '1px solid var(--border-subtle)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, items.map(it => {
    const active = it.key === value;
    if (it.primary) {
      return /*#__PURE__*/React.createElement("button", {
        key: it.key,
        "aria-label": it.label,
        onClick: () => onChange && onChange(it.key),
        style: {
          width: 48,
          height: 48,
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--accent)',
          color: 'var(--text-on-accent)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-2)'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: it.icon,
        size: 22
      }));
    }
    return /*#__PURE__*/React.createElement("button", {
      key: it.key,
      onClick: () => onChange && onChange(it.key),
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        minWidth: 56,
        padding: '6px 4px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: active ? 'var(--accent-text)' : 'var(--text-muted)',
        transition: 'color var(--duration-instant) var(--ease-glide)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: it.icon,
      size: 22,
      strokeWidth: active ? 2.4 : 2
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 11,
        fontWeight: active ? 600 : 500,
        letterSpacing: '0.02em'
      }
    }, it.label));
  }));
}
Object.assign(window.TacetDS, { BottomNav });
})();
})();
