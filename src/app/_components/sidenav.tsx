import Link from "next/link";



export default function Sidenav(props: { children: React.ReactNode }) {
  return <ul>{props.children}</ul>;
}

export function SidenavSeparator(props: { children: React.ReactNode }) {
  return <ul className=" px-4 pt-3 text-sm font-medium">{props.children}</ul>;
}

export function SidenavItem(props: {
  icon: React.ReactNode;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const className = `w-full flex gap-2 px-5 py-4 items-center 
    hover:bg-stone-100 active:bg-stone-200`;
  const content = (
    <>
      <div className=" items-center justify-center p-1 ">{props.icon}</div>
      <p className="text block w-full text-left text-sm font-semibold">
        {props.children}
      </p>
    </>
  );

  if (props.href) {
    return (
      <li>
        <Link href={props.href} className={className}>
          {content}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button className={className} onClick={props.onClick}>
        {content}
      </button>
    </li>
  );
}
