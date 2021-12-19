import { Secondary } from "components/Button/Button";
import { useAuth } from "context/AuthContext";
import Link from "next/link";
import PageWidth from "../PageWidth/PageWidth";

const Header = () => {
  const { profile } = useAuth();

  return (
    <PageWidth>
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center">
          <Link href="/" passHref>
            <h1 className="font-semibold text-3xl flex cursor-pointer">
              KbNews. <div className="animate-pulse w-0.5 ml-2 bg-black"></div>
            </h1>
          </Link>

          <div className="flex gap-2 ml-4">
            <p>Top</p>
            <p>New</p>
          </div>
        </div>

        {profile ? (
          <div className="flex items-center">
            <Link href="/account" passHref>
              <Secondary className="mr-1">{profile.username}</Secondary>
            </Link>
            |
            <Link href="/new" passHref>
              <Secondary className="ml-1">Submit</Secondary>
            </Link>
          </div>
        ) : (
          "Account"
        )}
      </div>
    </PageWidth>
  );
};

export default Header;
