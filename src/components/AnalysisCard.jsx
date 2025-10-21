const AnalysisCard = ({ value, title, OrderDataImage }) => {
  return (
    <section className="flex flex-wrap items-center h-auto p-4 border rounded-lg shadow-sm w-[280px] justify-center border-primary md:p-6">
      <div className="flex items-center justify-between gap-10 md:gap-10">
       <div className="p-3 border rounded-full border-primary">
       <img
          src={OrderDataImage}
          alt=""
          className="object-contain w-10 h-10 p-[1px] select-none"
        />
       </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1E1E1E]">
            {value}
          </h3>
          <p className="text-sm md:text-base text-[#1E1E1E]">{title}</p>
        </div>
      </div>
    </section>
  );
};

export default AnalysisCard;
