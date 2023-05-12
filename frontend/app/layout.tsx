import 'server-only';
import './globals.css';

// do not cache this layout
export const revalidate = 0;

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
          {children}
      </body>
    </html>
  );
}
