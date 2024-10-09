const CallToAction = () => {
  return (
    <div className="py-[72px] sm:py-24 text-center bg-gradient-to-b from-white to-[#232529]">
      <div className="container max-w-xl relative mx-auto">
        <h2 className="font-bold text-5xl tracking-tighter sm:text-6xl">
          Get instant access
        </h2>
        <p className="text-xl text-white mt-5">
          Explore all of our carefully crapfted apis for your next ivnestment
        </p>
        <form className="mt-10 flex flex-col gap-2.5 max-w-sm mx-auto sm:flex-row">
          <input
            type="email"
            placeholder="your@email.com"
            className="h-12 bg-white rounded-lg p-5 font-medium placeholder:text-[#9CA3AF] flex-1"
          />
          <button className="bg-black text-white h-12 rounded-lg px-5">
            Get access
          </button>
        </form>
      </div>
    </div>
  );
};

export default CallToAction;
