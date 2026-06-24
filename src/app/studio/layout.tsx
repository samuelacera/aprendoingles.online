export const metadata = {
  title: "Studio | aprendoingles.online",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body style={{ margin: 0, height: "100vh" }}>{children}</body>
    </html>
  );
}
