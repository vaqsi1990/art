import Copy from "@/components/Copy";
import Hero from "@/components/Hero";
import Popular from "@/components/Popular";
import Categories from "@/components/Categories";

export default function Page() {
  return (
    <>
      <div className="container">
        <div className="">
          <Copy delay={0.3}>
           <Hero />
          </Copy>
          <Copy delay={0.5}>
            <Categories />
          </Copy>
          <Copy delay={0.7}>
            <Popular />
          </Copy>
        </div>
      </div>  
    </>
  );
}
