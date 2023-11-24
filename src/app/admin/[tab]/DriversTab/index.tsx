"use client";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { capitalCase } from "change-case";
import { useCallback, useEffect, useState } from "react";
import { blockUser, getUsers } from "./actions";
import { Button } from "@/components/ui/button";
import AddUserModal from "./AddUserModal";

type DriversTabProps = {};
export default function DriversTab({}: DriversTabProps) {
  const [users, setUsers] = useState<
    (User & {
      bookingCount?: number | undefined;
    })[]
  >([]);

  useEffect(() => {
    getUsers().then((users) => setUsers(users));
  }, []);

  const handleOnChange = useCallback(() => {
    getUsers().then((users) => setUsers(users));
  }, []);

  const handleBlockUser = (id: string, blocked: boolean) => async () => {
    const updatedUser = await blockUser(id, blocked);
    setUsers((users) =>
      users.map((user) => {
        if (user.id === updatedUser.id) {
          return updatedUser;
        }
        return user;
      })
    );
  };

  return (
    <>
      <AddUserModal onChange={handleOnChange} />
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Name
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Email
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Bookings
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((person) => (
              <tr key={person.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {person.firstName} {person.lastName}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {person.emailAddresses[0].emailAddress}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {person.bookingCount}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <Button
                    variant="outline"
                    onClick={handleBlockUser(person.id, !person.publicMetadata.blocked)}>
                    {person.publicMetadata.blocked ? "Unblock" : "Block"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
