"use client";

import { useState, useEffect, useCallback } from "react";
import { Input, Avatar, message } from "antd";
import { DeleteOutlined, MailOutlined } from "@ant-design/icons";
import { subscriptionApi } from "@/lib/api";
import toast from "react-hot-toast";

interface FamilyMembersManagerProps {
  subscription: any;
  onRefresh?: () => void;
}

export default function FamilyMembersManager({
  subscription,
  onRefresh,
}: FamilyMembersManagerProps) {
  const [members, setMembers] = useState(subscription?.members || []);
  const [subscriptionId, setSubscriptionId] = useState(subscription?.id || "");
  const [newEmail, setNewEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Sync subscription on update
  useEffect(() => {
    if (subscription) {
      setSubscriptionId(subscription.id);
      setMembers(subscription.members || []);
    }
  }, [subscription]);

  // Fetch members from backend
  const fetchMembers = useCallback(async () => {
    if (!subscriptionId) return;

    try {
      const response = await subscriptionApi.getFamilyMembers(subscriptionId);
      setMembers(response.data.members || []);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  }, [subscriptionId]);

  // Add new family member
  const addMember = async () => {
    if (!newEmail) {
      setEmailError("Email is required");
      return;
    }

    setIsAdding(true);
    setEmailError(null);

    try {
      const payload = {
        subscriptionId, // must come from props or state
        memberEmail: newEmail,
      };

      const response = await subscriptionApi.addFamilyMember(payload);

      if (response?.success) {
        setNewEmail("");
        await fetchMembers(); // refresh members list
        onRefresh?.();
        toast.success("Member added successfully"); // notify parent (optional)
      } else {
        setEmailError(response?.message || "Adding member failed");
        toast.error(response?.message || "Adding member failed");
      }
    } catch (error: any) {
      const backendMessage =
        error?.response?.data?.errorMessages?.[0]?.message ||
        error?.response?.data?.message ||
        "Failed to add member";

      setEmailError(backendMessage);
    } finally {
      setIsAdding(false);
    }
  };

  // Remove family member
  const removeMember = async (memberId: string) => {
    setRemovingId(memberId);

    try {
      const response = await subscriptionApi.removeFamilyMember(
        subscriptionId,
        memberId
      );

      if (response.success) {
        await fetchMembers();
        onRefresh?.();
        toast.success("Member removed successfully");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    }

    setRemovingId(null);
  };

  return (
    <div className="mt-8 w-full bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-6 rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Family Members</h2>

      {/* Input */}
      <div className="flex gap-3 items-center">
        <Input
          prefix={<MailOutlined className="!text-white" />}
          type="email"
          placeholder="Enter email address"
          value={newEmail}
          onChange={(e) => {
            setNewEmail(e.target.value);
            setEmailError(null);
          }}
          disabled={isAdding}
          size="large"
          status={emailError ? "error" : undefined}
          className="flex-1 rounded-xl input-style "
        />

        <button
          onClick={addMember}
          disabled={isAdding}
          className="px-5 py-2 bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
        >
          {isAdding ? "Adding..." : "Add"}
        </button>
      </div>

      {emailError && <p className="text-red-400 mt-1">{emailError}</p>}

      {/* Members List */}
      <div className="mt-6 space-y-3">
        {members.map((member: any) => (
          <div
            key={member.id}
            className="flex items-center justify-between bg-[#1B1B35] p-3 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <Avatar src={member.user?.profilePic || "/avatar.png"} />
              <div>
                <p className="font-semibold">
                  {member.user?.firstName} {member.user?.lastName}
                </p>
                <p className="text-sm text-gray-300">{member.user?.email}</p>
              </div>
            </div>

            <button
              // onClick={() => removeMember(member?.user?.id)}
              onClick={() => {
                setPendingDeleteId(member?.user?.id);
                setShowDeleteModal(true);
              }}
              className="text-red-400 hover:text-red-200 cursor-pointer"
              disabled={removingId === member.id}
            >
              {removingId === member.id ? (
                "Removing..."
              ) : (
                <DeleteOutlined className="text-lg" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1B1B35] p-6 rounded-xl w-80 text-center">
            <h3 className="text-lg font-semibold mb-3">Are you sure?</h3>
            <p className="text-gray-300 mb-5">
              Do you want to delete this member, this action is irreversible?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setPendingDeleteId(null);
                }}
                className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (pendingDeleteId) {
                    removeMember(pendingDeleteId);
                  }
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
