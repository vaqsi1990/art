import Copy from "@/components/Copy";
import Hero from "@/components/Hero";
import Popular from "@/components/Popular";

export default function Page() {
  return (
    <>
      <div className="container">
        <div className="">
          <Copy delay={0.3}>
           <Hero />
          </Copy>
          <Copy delay={0.5}>
            <Popular />
          </Copy>
        </div>
      </div>  
    </>
  );
}
