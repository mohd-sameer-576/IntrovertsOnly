import { useAuthStore } from "../store/useAuthStore";

const ProfilePanel = ({ showProfile, onClose, onEdit, onDelete }) => {
  const { authUser, logout } = useAuthStore();

  return (
    <div
      className={`
    fixed md:static right-0 z-60 h-full w-[80%] md:w-[22%]
    bg-white/5 backdrop-blur-xl border-l border-white/10 p-6
    transition-transform duration-300
    ${showProfile ? "translate-x-0" : "translate-x-full md:translate-x-0"}
   `}
    >
      <button
        onClick={onClose}
        className="md:hidden mb-4 px-4 py-2 rounded-xl bg-red-500"
      >
        Close
      </button>

      <div className="flex flex-col items-center">
        {authUser?.profilePic ? (
          <img
            src={authUser.profilePic}
            alt={authUser.fullname}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover mb-4 border-2 border-fuchsia-500"
          />
        ) : (
          <div
            className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-linear-to-br
        from-fuchsia-500 to-purple-600 flex items-center
        justify-center text-2xl md:text-3xl font-bold mb-4"
          >
            {authUser?.fullname?.[0]}
          </div>
        )}

        <h3 className="text-lg font-semibold">{authUser?.fullname}</h3>
        <p className="text-sm text-gray-400 mb-6">{authUser?.email}</p>

        <button
          onClick={onEdit}
          className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
        >
          Edit Profile
        </button>

        <button
          onClick={logout}
          className="w-full py-2 rounded-xl bg-red-500 hover:bg-red-600 transition mt-3"
        >
          Logout
        </button>

        <button
          onClick={onDelete}
          className="w-full py-2 rounded-xl bg-red-700 hover:bg-red-800 transition mt-2 text-sm"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default ProfilePanel;
