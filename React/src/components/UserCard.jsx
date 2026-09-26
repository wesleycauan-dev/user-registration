import "./UserCard.css";

function UserCard({ user, onDelete }) {
  return (
    <div className="user-card">
      <img
        className="user-card-avatar"
        src={`https://robohash.org/${user._id}`}
      />
      <div className="user-card-info">
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Age: {user.age}</p>
      </div>
      <button className="user-card-delete" type="button" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}
export default UserCard;
