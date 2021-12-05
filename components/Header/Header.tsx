import PageWidth from "../PageWidth/PageWidth";

const Header = () => (
  <PageWidth>
    <div className="flex justify-between items-center py-4">
      <h1 className="font-semibold text-3xl flex">
        KbNews. <div className="animate-pulse w-1 ml-2 bg-black"></div>
      </h1>

      <div>Account</div>
    </div>
  </PageWidth>
);

export default Header;
