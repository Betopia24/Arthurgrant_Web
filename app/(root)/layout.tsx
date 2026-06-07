import Footer from "@/components/landing/Footer";
import Navbar from "@/components/shared/Navbar";
import GoogleTranslateWrapper from "@/components/shared/GoogleTranslateWrapper";
import ReduxStoreProvider from "@/redux/ReduxStoreProvider";
import ChatbotWidget from "@/components/shared/ChatbotWidget";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxStoreProvider>
      <GoogleTranslateWrapper>
        <Navbar />
        <main className="!overflow-hidden min-h-screen">{children}</main>
        <Footer />
        <ChatbotWidget />
      </GoogleTranslateWrapper>
    </ReduxStoreProvider>
  );
}
