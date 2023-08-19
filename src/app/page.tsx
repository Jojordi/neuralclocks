import TimerGallery from "@/app/TimerGallery";

//Home page for the application, displayed after a successful login or signup
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <TimerGallery/>
    </main>
  )
}
