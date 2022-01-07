import { Secondary } from "components/Button/Button";
import { useAuth } from "context/AuthContext";
import Link from "next/link";
import PageWidth from "components/PageWidth/PageWidth";

const Header = () => {
  const { profile } = useAuth();

  return (
    <>
      <PageWidth>
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" passHref>
              <h1 className="font-semibold text-3xl flex items-baseline cursor-pointer text-logo">
                KbNews.
                <div className="animate-pulse w-0.5 ml-2 h-6 bg-secondary"></div>
              </h1>
            </Link>

            <div className="flex gap-2 ml-4">
              <p>Top</p>
              <p>New</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Link href="/settings" passHref>
              <Secondary>Settings</Secondary>
            </Link>
            |
            {profile ? (
              <>
                <Link href="/account" passHref>
                  <Secondary className="text-tertiary">
                    {profile.username}
                  </Secondary>
                </Link>
                |
                <Link href="/new" passHref>
                  <Secondary>Submit</Secondary>
                </Link>
              </>
            ) : (
              <Link href="/account/login">Account</Link>
            )}
          </div>
        </div>
      </PageWidth>
    </>
  );
};

export default Header;
