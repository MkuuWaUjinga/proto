import "server-only";
import "./globals.css";
import { pinFileToIPFS } from "./util/ipfs";

// do not cache this layout
export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const filepath = "/home/floydd34dsh0t/Downloads/1649673527405 (1).jpeg";
  pinFileToIPFS(filepath);
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
