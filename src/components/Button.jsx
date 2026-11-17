import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';

/**
 * Button that renders a router <Link>, an <a>, or a <button>
 * depending on whether `to`, `href` or neither is passed.
 * variant: 'primary' | 'dark' | 'outline'
 */
export default function Button({
  children,
  variant = 'primary',
  to,
  href,
  onClick,
  type = 'button',
  icon,
  full = false,
  className = '',
  ...rest
}) {
  const cls = `btn btn--${variant}${full ? ' btn--full' : ''} ${className}`.trim();
  const content = (
    <>
      {children}
      {icon && <Icon name={icon} size={15} strokeWidth={2.2} />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} {...rest}>
      {content}
    </button>
  );
}
