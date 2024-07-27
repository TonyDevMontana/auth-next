import { UserInfo } from "@/app/components/user-info";
import { currentUser } from "@/data/current-user";

const ServerPage = async () => {
  const session = await currentUser();
  return (
    <div>
      <UserInfo label='💻 Server component' user={session} />
    </div>
  );
};

export default ServerPage;
