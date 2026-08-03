import { useRouter } from "./useRouter";

function Link({ to, onClick, children, ...props }) {
  const { navigate } = useRouter();

  function handleClick(event) {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey ||
      props.target === "_blank"
    ) {
      return;
    }

    if (to.startsWith("/")) {
      event.preventDefault();
      navigate(to);
    }
  }

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

export default Link;
