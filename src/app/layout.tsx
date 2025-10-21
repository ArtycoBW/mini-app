import "./globals.css";
import SideMenu from "./_components/SideMenu";
import RoleSwitcher from "./_components/RoleSwitcher";

export const metadata = { title: "mini" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-100dvh text-slate-900 bg-linear-to-b from-white to-emerald-50">
        <div className="mx-auto max-w-6xl flex">
          <SideMenu />
          <div className="flex-1 w-full">
            {children}
          </div>
        </div>
        <RoleSwitcher />
      </body>
    </html>
  );
}
