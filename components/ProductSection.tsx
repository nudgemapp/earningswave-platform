import React from "react";
import CustomHeader from "./CustomHeader";
import ReviewCard from "./ReviewCard";

function ProductSection() {
  const cardData = {
    avatarUrl: "/images/financial-expert.png",
    review:
      "EarningsWave has revolutionized how we analyze earnings calls. Its powerful API provides real-time insights that have significantly improved our investment strategies.",
    name: "Sarah Johnson",
    position: "Chief Investment Officer, FakeCompany Solutions",
  };
  return (
    <section>
      <div>
        <CustomHeader
          title="Designed for multiplayer."
          description="The first trully multiplayer CRM. After all, the best work doesn’t come from silos."
        />
      </div>

      <div className="w-full flex flex-col gap-[28px] items-center justify-center my-[64px] bg-white">
        <img
          src="/images/d_1.png"
          alt="design image"
          className="w-[calc(100vw-1.5rem)] md:w-[calc(100vw-8rem)]"
        />
        <img
          src="/images/d_2.png"
          alt="design image"
          className="w-[calc(100vw-1.5rem)] md:w-[calc(100vw-8rem)]"
        />
      </div>

      <div>
        <ReviewCard {...cardData} />
      </div>
    </section>
  );
}

export default ProductSection;
