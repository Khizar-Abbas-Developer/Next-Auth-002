"use client"
import Profile from "@/components/Profile/Profile";
const metadata = {
  openGraph: {
    title: 'Next.js',
    description: 'The React Framework for the Web',
    url: 'https://next-auth-002.vercel.app',
    siteName: 'Next.js Authentication',
    images: [
      {
        url: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', // Must be an absolute URL
        width: 800,
        height: 600,
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
}
export default function UserProfileEdit() {
  const handleProfileData = (data) => {
    console.log(data);
  };
  return (
    <>
      <Profile onProfileData={handleProfileData} />
    </>
  );
}