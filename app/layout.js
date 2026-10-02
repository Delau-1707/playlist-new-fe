import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "MyMusic",
  description: "Music playlist berbasis YouTube",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-zinc-950 text-zinc-100">
        <Navbar />

        <main>{children}</main>
      </body>
    </html>
  );
}