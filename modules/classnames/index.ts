export default function classNames(...classes: (string | boolean | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
