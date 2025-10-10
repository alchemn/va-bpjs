import Header from "@/components/Header";
// import Footer from "@/components/Footer";
import Main from "@/components/Main";
import FaceWatcher from "@/components/FaceDetection";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 via-white to-white">
      <Header />

      <main className="flex-1 relative">
        {/* area utama */}
        <div className="mx-auto w-full max-w-6xl px-6 py-12">
          <Main />
        </div>

        {/* kamera face recognition standby */}
        <div className="absolute bottom-6 right-6 z-50">
          <FaceWatcher />
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
