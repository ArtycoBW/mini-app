import "./globals.css";
import SideMenu from "./_components/SideMenu";
import RoleSwitcher from "./_components/RoleSwitcher";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-[100dvh] bg-[#0b1220] text-white">
        <div className="mx-auto max-w-6xl flex">
          <SideMenu />
          <div className="flex-1 p-4 md:p-6 w-full">{children}</div>
        </div>
        <RoleSwitcher />
      </body>
    </html>
  );
}
