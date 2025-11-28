"use client";

import React from "react";
import ProfileInfoCard from "../ui/card/ProfileInfoCard";
import SecurityCard from "../ui/card/SecurityCard";

interface ProfileSectionProps {
  firstName: string;
  lastName: string;
  hobby: string;
  language: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  isChangingPassword: boolean;
  setCurrentPassword: (val: string) => void;
  setNewPassword: (val: string) => void;
  setConfirmPassword: (val: string) => void;
  handleChangePassword: () => void;
  isUpdatingProfile: boolean;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setLanguage: (value: string) => void;
  setHobby: (value: string) => void;
  handleUpdateProfile: () => void;
  subscriptionType: string;
  subscriptionExpiry: string;
  handleRenewSubscription: () => void;
  Container: React.FC<React.PropsWithChildren<{ className?: string }>>;
  SubscriptionCard: React.FC<
    React.PropsWithChildren<{
      subscriptionType: string;
      subscriptionExpiry: string;
      handleRenewSubscription: () => void;
    }>
  >;
  
}

const ProfileSection: React.FC<ProfileSectionProps> = (props) => {
  const { Container, SubscriptionCard } = props;
  return (
    <Container className="py-10 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-28 flex flex-col gap-8">
      <ProfileInfoCard {...props} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <SubscriptionCard {...props} />
        <SecurityCard {...props} />
      </div>
    </Container>
  );
};

export default ProfileSection;
