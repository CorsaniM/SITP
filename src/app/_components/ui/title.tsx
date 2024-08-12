export function Title(props: { children: React.ReactNode }) {
  return <h2 className="flex text-2xl font-semibold justify-center">{props.children}</h2>;
}
export function Subtitle(props: { children: React.ReactNode }) {
  return <h2 className="flex text-xl font-semibold justify-center">{props.children}</h2>;
}
export function NumeroGrande(props: { children: React.ReactNode }) {
  return <h2 className="flex text-4xl font-bold justify-center">{props.children}</h2>;
}