import { Title } from "~/app/_components/ui/title";
import LayoutContainer from "~/app/_components/layout-container";


export default async function Home() {

  return (
    <LayoutContainer>
      <section className="">
        <div className="flex justify-between">
          <Title>Roles</Title>

        </div>
        
      </section>
    </LayoutContainer>
  );
}