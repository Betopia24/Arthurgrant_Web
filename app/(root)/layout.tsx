import Footer from "@/components/landing/Footer";
import Navbar from "@/components/shared/Navbar";
import GoogleTranslateWrapper from "@/components/shared/GoogleTranslateWrapper";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <GoogleTranslateWrapper>
        <Navbar />
        <main className="!overflow-hidden min-h-screen">{children}</main>
        <Footer />
      </GoogleTranslateWrapper>
    </>
  );
}
