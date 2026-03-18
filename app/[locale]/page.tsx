import Hero from "@/components/Hero";
import Featured from "@/components/Featured";
import Popular from "@/components/Popular";
import Categories from "@/components/Categories";

export default function Page() {
  return (
    <>
      <div className="container">
        <div className="">
          <Hero />
          <Featured />
          <Categories />
          <Popular />
        </div>
      </div>
    </>
  );
}

