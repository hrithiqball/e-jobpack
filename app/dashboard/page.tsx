import React from "react";

interface User {
  id: number;
  name: string;
}
const page = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const users: User[] = await res.json();
  return (
    <div className="bg-emeraldGreenDark text-white">
      <h1 className="text-3xl font-bold underline">Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default page;
