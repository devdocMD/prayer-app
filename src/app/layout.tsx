import "./globals.css";

export const metadata = {
  title: "마음기도",
  description: "감정과 상황에 따라 기도문을 추천하는 큐레이션 앱"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="text-ink">
        {children}
      </body>
    </html>
  );
}
