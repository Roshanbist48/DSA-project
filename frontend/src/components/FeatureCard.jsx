const FeatureCard = ({ title, description }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl text-left text-slate-100">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-200">{description}</p>
    </div>
  );
};

export default FeatureCard;
