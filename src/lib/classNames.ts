export default function classNames(...classes: (string | null)[]) {
  return classes.filter(Boolean).join(' ');
}
