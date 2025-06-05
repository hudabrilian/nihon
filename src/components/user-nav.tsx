import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";

interface UserNavProps {
  greeting?: boolean;
}

export default function UserNav(
  { greeting = true }: UserNavProps = { greeting: true }
) {
  const user = useQuery(api.users.getUser);
  const { signOut } = useAuthActions();

  return (
    <div className="dropdown dropdown-end">
      <div className="space-x-2">
        {greeting && <span>Hi, {user ? user.name : "Guest"} 👋🏻!</span>}
        <div
          tabIndex={0}
          role="button"
          //   className="avatar avatar-placeholder cursor-pointer"
          className={
            "avatar cursor-pointer" +
            (!user || !user.image ? " avatar-placeholder" : "")
          }
        >
          {!user || !user.image ? (
            <div className="bg-neutral text-neutral-content size-8 rounded-full">
              <span className="text-md">
                {user ? user.name!.charAt(0).toUpperCase() : "G"}
              </span>
            </div>
          ) : (
            <div className="size-8 rounded-full">
              <img src={user.image} />
            </div>
          )}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-300 rounded-box z-1 w-52 p-2 mt-2 mr-2 shadow-sm"
        >
          <li>
            <button onClick={() => void signOut()}>Sign Out</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
