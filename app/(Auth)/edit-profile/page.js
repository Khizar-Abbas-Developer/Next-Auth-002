import Profile from "@/components/Profile/Profile";
let userData;
const handleProfileData = async (data) => {
  userData = await data
  const username = data.username;
  const profile = data.image;
};
export const metadata = {
  openGraph: {
    title: {username},
    description: 'The React Framework for the Web',
    url: 'https://next-auth-002.vercel.app',
    siteName: 'Next.js Authentication',
    images: [
      {
        url: `${profile}`,
        height: 600,
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
}
export default function UserProfileEdit() {
  return (
    <>
      <Profile onProfileData={handleProfileData} />
    </>
  );
}